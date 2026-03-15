import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRelativeTime } from "../utils/formatting";
import { useTheme } from "../hooks/useTheme";

interface Props {
  fetchedAt: number | null;
  isStale: boolean;
  isOffline?: boolean;
  onPress?: () => void;
}

export function RateTimestamp({
  fetchedAt,
  isStale,
  isOffline = false,
  onPress,
}: Props) {
  const { colors } = useTheme();

  if (!fetchedAt) return null;

  const relativeTime = getRelativeTime(fetchedAt);
  const isOld = Date.now() - fetchedAt > 24 * 60 * 60 * 1000;

  let statusColor = colors.textTertiary;
  let statusIcon: "checkmark-circle" | "alert-circle" | "cloud-offline" =
    "checkmark-circle";

  if (isOffline) {
    statusColor = colors.warning;
    statusIcon = "cloud-offline";
  } else if (isOld || isStale) {
    statusColor = colors.warning;
    statusIcon = "alert-circle";
  }

  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mt-3 flex-row items-center justify-center py-2"
      accessibilityLabel={`Rates updated ${relativeTime}`}
    >
      <Ionicons name={statusIcon} size={14} color={statusColor} />
      <Text className="ml-1.5 text-xs" style={{ color: statusColor }}>
        Updated {relativeTime}
      </Text>
      {isOffline && (
        <Text className="ml-1 text-xs" style={{ color: statusColor }}>
          · Offline
        </Text>
      )}
    </Pressable>
  );
}
