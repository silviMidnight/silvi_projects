import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

interface Props {
  isOffline: boolean;
  lastUpdated?: number | null;
}

export function OfflineBanner({ isOffline, lastUpdated }: Props) {
  const { colors, isDark } = useTheme();

  if (!isOffline) return null;

  const bgColor = isDark ? "#78350F" : "#FEF9E7";
  const textColor = isDark ? "#FCD34D" : "#92400E";

  return (
    <View
      className="mx-5 mt-1 flex-row items-center rounded-xl px-3 py-1.5"
      style={{ backgroundColor: bgColor }}
    >
      <Ionicons name="cloud-offline" size={16} color={textColor} />
      <Text className="ml-2 flex-1 text-sm font-medium" style={{ color: textColor }}>
        You're offline — using cached rates
      </Text>
    </View>
  );
}
