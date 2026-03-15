import { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SwapButton } from "./SwapButton";
import { getCurrencyInfo } from "../utils/currencies";
import { useTheme } from "../hooks/useTheme";
import { usePressAnimation } from "../hooks/usePressAnimation";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const { colors, isDark } = useTheme();
  const baseInfo = getCurrencyInfo(base);
  const targetInfo = getCurrencyInfo(target);

  const baseAnim = usePressAnimation(0.95);
  const targetAnim = usePressAnimation(0.95);
  const favAnim = usePressAnimation(0.9);

  const handleToggleFavorite = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleFavorite();
  }, [onToggleFavorite]);

  const favBg = isFavorite
    ? isDark
      ? "#78350F"
      : "#FEF3C7"
    : colors.surfaceSecondary;

  const favColor = isFavorite ? colors.accent : colors.textTertiary;

  return (
    <View className="px-5 pb-4 pt-2">
      <View className="flex-row items-center justify-center">
        <Animated.View
          style={{ flex: 1, transform: [{ scale: baseAnim.scale }] }}
        >
          <Pressable
            onPress={onBasePress}
            onPressIn={baseAnim.onPressIn}
            onPressOut={baseAnim.onPressOut}
            className="items-center rounded-2xl p-3"
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
        </Animated.View>

        <SwapButton onSwap={onSwap} />

        <Animated.View
          style={{ flex: 1, transform: [{ scale: targetAnim.scale }] }}
        >
          <Pressable
            onPress={onTargetPress}
            onPressIn={targetAnim.onPressIn}
            onPressOut={targetAnim.onPressOut}
            className="items-center rounded-2xl p-3"
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
        </Animated.View>
      </View>

      <Animated.View
        style={{
          alignSelf: "center",
          transform: [{ scale: favAnim.scale }],
        }}
      >
        <Pressable
          onPress={handleToggleFavorite}
          onPressIn={favAnim.onPressIn}
          onPressOut={favAnim.onPressOut}
          className="mt-3 flex-row items-center justify-center rounded-full px-4 py-2"
          style={{
            backgroundColor: favBg,
            borderWidth: isFavorite ? 1 : 0,
            borderColor: isFavorite ? colors.accent : "transparent",
          }}
          accessibilityLabel={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={16}
            color={favColor}
          />
          <Text
            className="ml-1.5 text-xs font-semibold"
            style={{ color: favColor }}
          >
            {isFavorite ? "Saved" : "Add to favorites"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
