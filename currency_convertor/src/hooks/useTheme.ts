import { useColorScheme } from "react-native";
import { useCurrencyStore } from "../store/currencyStore";

export function useTheme() {
  const theme = useCurrencyStore((s) => s.theme);
  const systemScheme = useColorScheme();

  const isDark =
    theme === "system" ? systemScheme === "dark" : theme === "dark";

  return {
    isDark,
    theme,
    colors: {
      background: isDark ? "#0F172A" : "#EEF2F7",
      surface: isDark ? "#1E293B" : "#FFFFFF",
      surfaceSecondary: isDark ? "#334155" : "#E2E8F0",
      text: isDark ? "#F1F5F9" : "#0F172A",
      textSecondary: isDark ? "#94A3B8" : "#475569",
      textTertiary: isDark ? "#64748B" : "#64748B",
      border: isDark ? "#334155" : "#CBD5E1",
      primary: isDark ? "#60A5FA" : "#2563EB",
      primaryMuted: isDark ? "#1E3A5F" : "#DBEAFE",
      accent: isDark ? "#F59E0B" : "#F59E0B",
      error: "#EF4444",
      warning: isDark ? "#FCD34D" : "#F59E0B",
      subRowEven: isDark ? "#1E2A40" : "#F0F4FA",
      subRowOdd: isDark ? "#253349" : "#E6EBF5",
      tableDivider: isDark ? "#4B6A9B" : "#6B83B0",
    },
  };
}
