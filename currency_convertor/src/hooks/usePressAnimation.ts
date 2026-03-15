import { useRef, useCallback } from "react";
import { Animated } from "react-native";

export function usePressAnimation(toValue = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale, toValue]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
