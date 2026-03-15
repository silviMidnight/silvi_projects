export interface ExchangeRateService {
  getLatestRates(base: string, targets?: string[]): Promise<FrankfurterResponse>;
  getCurrencies(): Promise<Record<string, string>>;
}

export interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}
