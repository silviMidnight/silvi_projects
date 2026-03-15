import { useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCurrencyStore } from "@/store/currencyStore";
import { CurrencySelector } from "@/components/CurrencySelector";

export default function CurrencySelectScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: "base" | "target" }>();

  const baseCurrency = useCurrencyStore((s) => s.baseCurrency);
  const targetCurrency = useCurrencyStore((s) => s.targetCurrency);
  const setBaseCurrency = useCurrencyStore((s) => s.setBaseCurrency);
  const setTargetCurrency = useCurrencyStore((s) => s.setTargetCurrency);

  const selected = mode === "base" ? baseCurrency : targetCurrency;

  const handleSelect = useCallback(
    (code: string) => {
      if (mode === "base") {
        setBaseCurrency(code);
      } else {
        setTargetCurrency(code);
      }
      router.back();
    },
    [mode, setBaseCurrency, setTargetCurrency, router]
  );

  return <CurrencySelector selected={selected} onSelect={handleSelect} />;
}
