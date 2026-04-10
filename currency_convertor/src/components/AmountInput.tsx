import { useState, useRef } from "react";
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
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      className="mx-5 rounded-2xl p-3"
      style={{
        backgroundColor: colors.surface,
        borderWidth: isFocused ? 1.5 : 0,
        borderColor: isFocused ? colors.primary : "transparent",
      }}
      onTouchEnd={() => inputRef.current?.focus()}
    >
      <Text
        className="font-medium mb-1"
        style={{ color: colors.textTertiary, fontSize: 14.4 }}
      >
        Enter amount
      </Text>

      <View className="flex-row items-center">
        <TextInput
          ref={inputRef}
          className="flex-1 text-xl font-bold"
          style={{ color: colors.text }}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="decimal-pad"
          placeholder="Type any amount..."
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel="Enter amount to convert"
          returnKeyType="done"
          selectTextOnFocus
        />
        <Text
          className="ml-2 text-base font-semibold"
          style={{ color: colors.textSecondary }}
        >
          {baseCurrency}
        </Text>
      </View>

      <View
        className="my-1.5 h-px"
        style={{ backgroundColor: colors.border }}
      />

      <View className="flex-row items-baseline">
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          {getCurrencySymbol(targetCurrency)}{" "}
        </Text>
        <Text
          className="text-xl font-bold"
          style={{ color: colors.primary }}
        >
          {formattedResult}
        </Text>
        <Text
          className="ml-2 text-base font-semibold"
          style={{ color: colors.textSecondary }}
        >
          {targetCurrency}
        </Text>
      </View>
    </View>
  );
}
