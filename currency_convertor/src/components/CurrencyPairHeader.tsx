import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SwapButton } from "./SwapButton";
import { getCurrencyInfo } from "../utils/currencies";
import { useTheme } from "../hooks/useTheme";

interface Props {
  base: string;
  target: string;
  onBasePress: () => void;
  onTargetPress: () => void;
  onSwap: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CurrencyPairHeader({
  base,
  target,
  onBasePress,
  onTargetPress,
  onSwap,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const { colors } = useTheme();
  const baseInfo = getCurrencyInfo(base);
  const targetInfo = getCurrencyInfo(target);

  return (
    <View className="px-5 pb-4 pt-2">
      <View className="flex-row items-center justify-center">
        <Pressable
          onPress={onBasePress}
          className="flex-1 items-center rounded-2xl p-3"
          style={{ backgroundColor: colors.surface }}
          accessibilityLabel={`Base currency: ${baseInfo.name}`}
        >
          <Text
            className="text-3xl font-bold"
            style={{ color: colors.text }}
          >
            {base}
          </Text>
          <Text
            className="mt-1 text-xs"
            style={{ color: colors.textSecondary }}
            numberOfLines={1}
          >
            {baseInfo.name}
          </Text>
        </Pressable>

        <SwapButton onSwap={onSwap} />

        <Pressable
          onPress={onTargetPress}
          className="flex-1 items-center rounded-2xl p-3"
          style={{ backgroundColor: colors.surface }}
          accessibilityLabel={`Target currency: ${targetInfo.name}`}
        >
          <Text
            className="text-3xl font-bold"
            style={{ color: colors.text }}
          >
            {target}
          </Text>
          <Text
            className="mt-1 text-xs"
            style={{ color: colors.textSecondary }}
            numberOfLines={1}
          >
            {targetInfo.name}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onToggleFavorite}
        className="mt-3 flex-row items-center justify-center self-center rounded-full px-4 py-1.5"
        style={{ backgroundColor: colors.surfaceSecondary }}
        accessibilityLabel={
          isFavorite ? "Remove from favorites" : "Add to favorites"
        }
      >
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={16}
          color={isFavorite ? colors.accent : colors.textTertiary}
        />
        <Text
          className="ml-1.5 text-xs font-medium"
          style={{
            color: isFavorite ? colors.accent : colors.textTertiary,
          }}
        >
          {isFavorite ? "Saved" : "Save pair"}
        </Text>
      </Pressable>
    </View>
  );
}
