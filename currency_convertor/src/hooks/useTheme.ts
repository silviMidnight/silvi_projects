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
      background: isDark ? "#0F172A" : "#F8FAFC",
      surface: isDark ? "#1E293B" : "#FFFFFF",
      surfaceSecondary: isDark ? "#334155" : "#F1F5F9",
      text: isDark ? "#F1F5F9" : "#0F172A",
      textSecondary: isDark ? "#94A3B8" : "#64748B",
      textTertiary: isDark ? "#64748B" : "#94A3B8",
      border: isDark ? "#334155" : "#E2E8F0",
      primary: isDark ? "#60A5FA" : "#2563EB",
      primaryMuted: isDark ? "#1E3A5F" : "#DBEAFE",
      accent: isDark ? "#F59E0B" : "#F59E0B",
      error: "#EF4444",
      warning: isDark ? "#FCD34D" : "#F59E0B",
    },
  };
}
