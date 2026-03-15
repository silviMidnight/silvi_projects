import type { ExchangeRateService, FrankfurterResponse } from "./types";

const BASE_URL = "https://api.frankfurter.dev/v1";

class FrankfurterApi implements ExchangeRateService {
  async getLatestRates(
    base: string,
    targets?: string[]
  ): Promise<FrankfurterResponse> {
    const params = new URLSearchParams({ base });
    if (targets?.length) {
      params.set("symbols", targets.join(","));
    }

    const response = await fetch(`${BASE_URL}/latest?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrencies(): Promise<Record<string, string>> {
    const response = await fetch(`${BASE_URL}/currencies`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const exchangeRateApi: ExchangeRateService = new FrankfurterApi();
