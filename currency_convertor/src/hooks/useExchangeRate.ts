import { useQuery } from "@tanstack/react-query";
import { exchangeRateApi } from "../services/exchangeRateApi";
import { useCurrencyStore } from "../store/currencyStore";
import type { CachedRateData } from "../types";

export function useExchangeRate(base: string, target: string) {
  const updateCachedRates = useCurrencyStore((s) => s.updateCachedRates);
  const cachedRates = useCurrencyStore((s) => s.cachedRates);
  const cached = cachedRates[base];

  return useQuery({
    queryKey: ["exchangeRate", base],
    queryFn: async () => {
      const data = await exchangeRateApi.getLatestRates(base);

      const cacheEntry: CachedRateData = {
        base: data.base,
        rates: data.rates,
        fetchedAt: Date.now(),
        apiDate: data.date,
      };
      updateCachedRates(base, cacheEntry);

      return cacheEntry;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    placeholderData: cached ?? undefined,
    meta: { target },
  });
}

export function useRate(base: string, target: string): {
  rate: number | null;
  isLoading: boolean;
  isError: boolean;
  isStale: boolean;
  fetchedAt: number | null;
  apiDate: string | null;
  refetch: () => void;
} {
  const query = useExchangeRate(base, target);

  const data = query.data;
  let rate: number | null = null;

  if (data?.rates) {
    if (base === target) {
      rate = 1;
    } else {
      rate = data.rates[target] ?? null;
    }
  }

  return {
    rate,
    isLoading: query.isLoading,
    isError: query.isError,
    isStale: query.isStale,
    fetchedAt: data?.fetchedAt ?? null,
    apiDate: data?.apiDate ?? null,
    refetch: query.refetch,
  };
}
