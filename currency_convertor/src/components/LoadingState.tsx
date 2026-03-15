import { View, ActivityIndicator, Text } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface Props {
  message?: string;
}

export function LoadingState({ message = "Loading rates..." }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-4 text-base" style={{ color: colors.textSecondary }}>
        {message}
      </Text>
    </View>
  );
}
