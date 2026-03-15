import { useRate } from "./useExchangeRate";
import { formatCurrencyValue } from "../utils/formatting";

interface ConversionResult {
  rate: number | null;
  convertedAmount: number | null;
  formattedAmount: string;
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

  return {
    rate,
    convertedAmount,
    formattedAmount,
    isLoading,
    isError,
    isStale,
    fetchedAt,
    apiDate,
    refetch,
  };
}
