import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrencyStore } from "@/store/currencyStore";
import { useConversion } from "@/hooks/useConversion";
import { useTheme } from "@/hooks/useTheme";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { CurrencyPairHeader } from "@/components/CurrencyPairHeader";
import { AmountInput } from "@/components/AmountInput";
import { ConversionTable } from "@/components/ConversionTable";
import { RateTimestamp } from "@/components/RateTimestamp";
import { OfflineBanner } from "@/components/OfflineBanner";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

export default function ConverterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isConnected } = useNetworkStatus();

  const baseCurrency = useCurrencyStore((s) => s.baseCurrency);
  const targetCurrency = useCurrencyStore((s) => s.targetCurrency);
  const swapCurrencies = useCurrencyStore((s) => s.swapCurrencies);
  const addFavorite = useCurrencyStore((s) => s.addFavorite);
  const removeFavorite = useCurrencyStore((s) => s.removeFavorite);
  const isFavorite = useCurrencyStore((s) => s.isFavorite);

  const [customAmount, setCustomAmount] = useState("1");

  const numericAmount = parseFloat(customAmount) || 0;

  const {
    formattedAmount,
    tableRows,
    isLoading,
    isError,
    isStale,
    fetchedAt,
    refetch,
  } = useConversion(baseCurrency, targetCurrency, numericAmount);

  const pair = { base: baseCurrency, target: targetCurrency };
  const pairIsFavorite = isFavorite(pair);

  const handleToggleFavorite = useCallback(() => {
    if (pairIsFavorite) {
      removeFavorite(pair);
    } else {
      addFavorite(pair);
    }
  }, [pairIsFavorite, pair, addFavorite, removeFavorite]);

  const handleBasePress = useCallback(() => {
    router.push({ pathname: "/currency-select", params: { mode: "base" } });
  }, [router]);

  const handleTargetPress = useCallback(() => {
    router.push({ pathname: "/currency-select", params: { mode: "target" } });
  }, [router]);

  const handleRatePress = useCallback(() => {
    router.push({
      pathname: "/rate-details",
      params: { base: baseCurrency, target: targetCurrency },
    });
  }, [router, baseCurrency, targetCurrency]);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && !tableRows.length) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (isError && !tableRows.length) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <OfflineBanner isOffline={!isConnected} lastUpdated={fetchedAt} />

          <CurrencyPairHeader
            base={baseCurrency}
            target={targetCurrency}
            onBasePress={handleBasePress}
            onTargetPress={handleTargetPress}
            onSwap={swapCurrencies}
            isFavorite={pairIsFavorite}
            onToggleFavorite={handleToggleFavorite}
          />

          <AmountInput
            value={customAmount}
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
            formattedResult={formattedAmount}
            onChange={setCustomAmount}
          />

          <ConversionTable
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
            rows={tableRows}
          />

          <RateTimestamp
            fetchedAt={fetchedAt}
            isStale={isStale}
            isOffline={!isConnected}
            onPress={handleRatePress}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
