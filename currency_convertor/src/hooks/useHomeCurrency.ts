import { useEffect } from "react";
import { getLocales } from "expo-localization";
import { useCurrencyStore } from "../store/currencyStore";

export function useHomeCurrency(): string {
  const homeCurrency = useCurrencyStore((s) => s.homeCurrency);
  const isInitialized = useCurrencyStore((s) => s.isInitialized);
  const initialize = useCurrencyStore((s) => s.initialize);

  useEffect(() => {
    if (isInitialized) return;
    const locales = getLocales();
    const detected = locales[0]?.currencyCode ?? "EUR";
    initialize(detected);
  }, [isInitialized, initialize]);

  return homeCurrency;
}
