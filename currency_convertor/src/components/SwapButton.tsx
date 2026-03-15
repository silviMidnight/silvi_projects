import { useRef, useCallback } from "react";
import { Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { usePressAnimation } from "../hooks/usePressAnimation";

interface Props {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: Props) {
  const { colors } = useTheme();
  const { scale, onPressIn, onPressOut } = usePressAnimation(0.85);

  const rotation = useRef(new Animated.Value(0)).current;
  const rotationTarget = useRef(0);

  const handleSwap = useCallback(() => {
    rotationTarget.current += 180;
    Animated.spring(rotation, {
      toValue: rotationTarget.current,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
    onSwap();
  }, [onSwap, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale }, { rotate: spin }],
      }}
    >
      <Pressable
        onPress={handleSwap}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="mx-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primaryMuted }}
        accessibilityLabel="Swap currencies"
        accessibilityRole="button"
      >
        <Ionicons name="swap-horizontal" size={22} color={colors.primary} />
      </Pressable>
    </Animated.View>
  );
}
