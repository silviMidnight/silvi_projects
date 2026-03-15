import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({
  icon = "documents-outline",
  title,
  subtitle,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center p-8">
      <Ionicons name={icon} size={48} color={colors.textTertiary} />
      <Text
        className="mt-4 text-center text-base font-medium"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          className="mt-2 text-center text-sm"
          style={{ color: colors.textTertiary }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
