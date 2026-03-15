import { View, Text, TextInput } from "react-native";
import { getCurrencySymbol } from "../utils/currencies";
import { useTheme } from "../hooks/useTheme";

interface Props {
  value: string;
  baseCurrency: string;
  targetCurrency: string;
  formattedResult: string;
  onChange: (text: string) => void;
}

export function AmountInput({
  value,
  baseCurrency,
  targetCurrency,
  formattedResult,
  onChange,
}: Props) {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="mx-5 rounded-2xl p-4"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 text-2xl font-bold"
          style={{ color: colors.text }}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel="Enter amount"
          returnKeyType="done"
          selectTextOnFocus
        />
        <Text
          className="ml-2 text-lg font-semibold"
          style={{ color: colors.textSecondary }}
        >
          {baseCurrency}
        </Text>
      </View>

      <View
        className="my-3 h-px"
        style={{ backgroundColor: colors.border }}
      />

      <View className="flex-row items-baseline">
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {getCurrencySymbol(targetCurrency)}{" "}
        </Text>
        <Text
          className="text-2xl font-bold"
          style={{ color: colors.primary }}
        >
          {formattedResult}
        </Text>
        <Text
          className="ml-2 text-lg font-semibold"
          style={{ color: colors.textSecondary }}
        >
          {targetCurrency}
        </Text>
      </View>
    </View>
  );
}
