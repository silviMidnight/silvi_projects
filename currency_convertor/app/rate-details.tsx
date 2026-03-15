import { useCallback } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRate } from "@/hooks/useExchangeRate";
import { useTheme } from "@/hooks/useTheme";
import { getCurrencyInfo } from "@/utils/currencies";
import { formatRate, formatFullDate } from "@/utils/formatting";

export default function RateDetailsScreen() {
  const { colors } = useTheme();
  const { base, target } = useLocalSearchParams<{
    base: string;
    target: string;
  }>();

  const baseCurrency = base ?? "EUR";
  const targetCurrency = target ?? "USD";

  const { rate, isLoading, fetchedAt, apiDate, refetch } = useRate(
    baseCurrency,
    targetCurrency
  );

  const baseInfo = getCurrencyInfo(baseCurrency);
  const targetInfo = getCurrencyInfo(targetCurrency);

  const inverseRate = rate != null && rate !== 0 ? 1 / rate : null;

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View
        className="mx-5 mt-6 items-center rounded-2xl p-8"
        style={{ backgroundColor: colors.surface }}
      >
        <Text
          className="text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {baseInfo.name}
        </Text>
        <View className="mt-3 flex-row items-baseline">
          <Text
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            1 {baseCurrency} ={" "}
          </Text>
          {isLoading && rate == null ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text
              className="text-4xl font-bold"
              style={{ color: colors.primary }}
            >
              {rate != null ? formatRate(rate) : "—"}
            </Text>
          )}
          <Text
            className="ml-2 text-lg"
            style={{ color: colors.textSecondary }}
          >
            {targetCurrency}
          </Text>
        </View>
        <Text
          className="mt-1 text-sm"
          style={{ color: colors.textSecondary }}
        >
          {targetInfo.name}
        </Text>
      </View>

      {inverseRate != null && (
        <View
          className="mx-5 mt-4 items-center rounded-2xl p-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Text
            className="text-sm font-medium"
            style={{ color: colors.textSecondary }}
          >
            Inverse Rate
          </Text>
          <View className="mt-2 flex-row items-baseline">
            <Text
              className="text-lg"
              style={{ color: colors.textSecondary }}
            >
              1 {targetCurrency} ={" "}
            </Text>
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.text }}
            >
              {formatRate(inverseRate)}
            </Text>
            <Text
              className="ml-2 text-lg"
              style={{ color: colors.textSecondary }}
            >
              {baseCurrency}
            </Text>
          </View>
        </View>
      )}

      <View
        className="mx-5 mt-4 rounded-2xl p-5"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row items-center">
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text
            className="ml-2 text-sm font-medium"
            style={{ color: colors.textSecondary }}
          >
            Last Updated
          </Text>
        </View>
        <Text className="mt-2 text-base" style={{ color: colors.text }}>
          {fetchedAt ? formatFullDate(fetchedAt) : "—"}
        </Text>

        {apiDate && (
          <>
            <View className="mt-4 flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text
                className="ml-2 text-sm font-medium"
                style={{ color: colors.textSecondary }}
              >
                ECB Publication Date
              </Text>
            </View>
            <Text className="mt-2 text-base" style={{ color: colors.text }}>
              {apiDate}
            </Text>
          </>
        )}

        <View className="mt-4 flex-row items-center">
          <Ionicons
            name="globe-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text
            className="ml-2 text-sm font-medium"
            style={{ color: colors.textSecondary }}
          >
            Source
          </Text>
        </View>
        <Text className="mt-2 text-base" style={{ color: colors.text }}>
          European Central Bank via Frankfurter API
        </Text>
      </View>

      <Pressable
        onPress={handleRefresh}
        className="mx-5 mt-6 flex-row items-center justify-center rounded-xl py-3.5"
        style={{ backgroundColor: colors.primary }}
        accessibilityLabel="Refresh rates"
        accessibilityRole="button"
      >
        <Ionicons name="refresh" size={18} color="#FFFFFF" />
        <Text className="ml-2 text-base font-semibold text-white">
          Refresh Rate
        </Text>
      </Pressable>
    </ScrollView>
  );
}
