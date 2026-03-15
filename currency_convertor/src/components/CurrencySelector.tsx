import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CURRENCIES, searchCurrencies, getCurrencySymbol } from "../utils/currencies";
import { useTheme } from "../hooks/useTheme";
import type { CurrencyInfo } from "../types";

interface Props {
  selected: string;
  onSelect: (code: string) => void;
}

function CurrencyRow({
  item,
  isSelected,
  onPress,
}: {
  item: CurrencyInfo;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-3.5"
      style={{
        backgroundColor: isSelected ? colors.primaryMuted : "transparent",
      }}
      accessibilityLabel={`${item.code} - ${item.name}`}
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.surfaceSecondary }}
      >
        <Text className="text-base font-bold" style={{ color: colors.text }}>
          {item.symbol}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold" style={{ color: colors.text }}>
          {item.code}
        </Text>
        <Text
          className="mt-0.5 text-sm"
          style={{ color: colors.textSecondary }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      )}
    </Pressable>
  );
}

export function CurrencySelector({ selected, onSelect }: Props) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => searchCurrencies(query), [query]);

  const renderItem = useCallback(
    ({ item }: { item: CurrencyInfo }) => (
      <CurrencyRow
        item={item}
        isSelected={item.code === selected}
        onPress={() => onSelect(item.code)}
      />
    ),
    [selected, onSelect]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-5 pb-3 pt-2">
        <View
          className="flex-row items-center rounded-xl px-4 py-2.5"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            className="ml-2 flex-1 text-base"
            style={{ color: colors.text }}
            placeholder="Search currencies..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textTertiary}
              />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => (
          <View
            className="ml-16 h-px"
            style={{ backgroundColor: colors.border }}
          />
        )}
        initialNumToRender={31}
      />
    </View>
  );
}
