import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Failed to load exchange rates",
  onRetry,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
      <Text
        className="mt-4 text-center text-base font-medium"
        style={{ color: colors.text }}
      >
        {message}
      </Text>
      <Text
        className="mt-2 text-center text-sm"
        style={{ color: colors.textSecondary }}
      >
        Check your internet connection and try again
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-6 rounded-xl px-8 py-3"
          style={{ backgroundColor: colors.primary }}
          accessibilityLabel="Retry"
          accessibilityRole="button"
        >
          <Text className="text-base font-semibold text-white">
            Try Again
          </Text>
        </Pressable>
      )}
    </View>
  );
}
