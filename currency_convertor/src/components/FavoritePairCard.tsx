import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCurrencyInfo } from "../utils/currencies";
import { formatRate } from "../utils/formatting";
import { useTheme } from "../hooks/useTheme";
import type { CurrencyPair } from "../types";

interface Props {
  pair: CurrencyPair;
  rate: number | null;
  onPress: () => void;
  onDelete: () => void;
}

export function FavoritePairCard({ pair, rate, onPress, onDelete }: Props) {
  const { colors } = useTheme();
  const baseInfo = getCurrencyInfo(pair.base);
  const targetInfo = getCurrencyInfo(pair.target);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl p-4"
      style={{ backgroundColor: colors.surface }}
      accessibilityLabel={`${pair.base} to ${pair.target}`}
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            {pair.base}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.textTertiary}
            style={{ marginHorizontal: 8 }}
          />
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            {pair.target}
          </Text>
        </View>
        <Text
          className="mt-1 text-xs"
          style={{ color: colors.textSecondary }}
        >
          {baseInfo.name} → {targetInfo.name}
        </Text>
      </View>

      {rate != null && (
        <Text
          className="mr-3 text-base font-semibold"
          style={{ color: colors.primary }}
        >
          {formatRate(rate)}
        </Text>
      )}

      <Pressable
        onPress={onDelete}
        hitSlop={12}
        accessibilityLabel="Remove from favorites"
      >
        <Ionicons name="close-circle" size={22} color={colors.textTertiary} />
      </Pressable>
    </Pressable>
  );
}
