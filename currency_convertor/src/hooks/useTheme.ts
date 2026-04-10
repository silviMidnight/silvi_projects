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
      background: isDark ? "#0F172A" : "#F0EEE9",
      surface: isDark ? "#1E293B" : "#FAF9F7",
      surfaceSecondary: isDark ? "#334155" : "#E2DDD6",
      text: isDark ? "#F1F5F9" : "#1C1917",
      textSecondary: isDark ? "#94A3B8" : "#57534E",
      textTertiary: isDark ? "#64748B" : "#78716C",
      border: isDark ? "#334155" : "#D6D3CE",
      primary: isDark ? "#60A5FA" : "#2563EB",
      primaryMuted: isDark ? "#1E3A5F" : "#DBEAFE",
      accent: isDark ? "#F59E0B" : "#D97706",
      error: "#EF4444",
      warning: isDark ? "#FCD34D" : "#D97706",
      subRowEven: isDark ? "#1E2A40" : "#E6E2DB",
      subRowOdd: isDark ? "#253349" : "#DBD6CD",
      tableDivider: isDark ? "#4B6A9B" : "#A8A29E",
    },
  };
}
