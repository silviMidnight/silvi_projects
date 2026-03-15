import { useMemo } from "react";
import { useRate } from "./useExchangeRate";
import { generateTableValues } from "../utils/tableScaling";
import { formatCurrencyValue } from "../utils/formatting";

interface ConversionResult {
  rate: number | null;
  convertedAmount: number | null;
  formattedAmount: string;
  tableRows: { baseValue: number; targetValue: string }[];
  isLoading: boolean;
  isError: boolean;
  isStale: boolean;
  fetchedAt: number | null;
  apiDate: string | null;
  refetch: () => void;
}

export function useConversion(
  base: string,
  target: string,
  customAmount: number
): ConversionResult {
  const {
    rate,
    isLoading,
    isError,
    isStale,
    fetchedAt,
    apiDate,
    refetch,
  } = useRate(base, target);

  const convertedAmount = rate != null ? customAmount * rate : null;

  const formattedAmount =
    convertedAmount != null
      ? formatCurrencyValue(convertedAmount, target)
      : "—";

  const tableRows = useMemo(() => {
    if (rate == null) return [];
    const values = generateTableValues(rate);
    return values.map((v) => ({
      baseValue: v,
      targetValue: formatCurrencyValue(v * rate, target),
    }));
  }, [rate, target]);

  return {
    rate,
    convertedAmount,
    formattedAmount,
    tableRows,
    isLoading,
    isError,
    isStale,
    fetchedAt,
    apiDate,
    refetch,
  };
}
