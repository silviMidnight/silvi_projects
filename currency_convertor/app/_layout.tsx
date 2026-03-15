import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { getLocales } from "expo-localization";
import { useCurrencyStore } from "@/store/currencyStore";
import "../global.css";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 2,
      refetchOnReconnect: true,
    },
  },
});

function InitializeApp() {
  const initialize = useCurrencyStore((s) => s.initialize);
  const isInitialized = useCurrencyStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized) return;
    const locales = getLocales();
    const deviceCurrency = locales[0]?.currencyCode ?? "EUR";
    initialize(deviceCurrency);
  }, [isInitialized, initialize]);

  return null;
}

export default function RootLayout() {
  const theme = useCurrencyStore((s) => s.theme);
  const systemScheme = useColorScheme();
  const effectiveTheme = theme === "system" ? systemScheme ?? "light" : theme;

  return (
    <QueryClientProvider client={queryClient}>
      <InitializeApp />
      <StatusBar style={effectiveTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: effectiveTheme === "dark" ? "#0F172A" : "#F8FAFC",
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="rate-details"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Rate Details",
            headerStyle: {
              backgroundColor:
                effectiveTheme === "dark" ? "#1E293B" : "#FFFFFF",
            },
            headerTintColor:
              effectiveTheme === "dark" ? "#F1F5F9" : "#0F172A",
          }}
        />
        <Stack.Screen
          name="currency-select"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Select Currency",
            headerStyle: {
              backgroundColor:
                effectiveTheme === "dark" ? "#1E293B" : "#FFFFFF",
            },
            headerTintColor:
              effectiveTheme === "dark" ? "#F1F5F9" : "#0F172A",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
