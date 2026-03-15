import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

interface Props {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onSwap}
      className="mx-3 h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: colors.primaryMuted }}
      accessibilityLabel="Swap currencies"
      accessibilityRole="button"
    >
      <Ionicons name="swap-horizontal" size={22} color={colors.primary} />
    </Pressable>
  );
}
