import { View, Text, FlatList } from "react-native";
import { formatCurrencyValue } from "../utils/formatting";
import { getCurrencySymbol } from "../utils/currencies";
import { useTheme } from "../hooks/useTheme";

interface TableRow {
  baseValue: number;
  targetValue: string;
}

interface Props {
  baseCurrency: string;
  targetCurrency: string;
  rows: TableRow[];
}

function TableHeader({
  baseCurrency,
  targetCurrency,
}: {
  baseCurrency: string;
  targetCurrency: string;
}) {
  const { colors } = useTheme();

  return (
    <View
      className="mb-1 flex-row items-center px-5 py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <Text
        className="flex-1 text-sm font-semibold"
        style={{ color: colors.textSecondary }}
      >
        {baseCurrency}
      </Text>
      <Text
        className="flex-1 text-right text-sm font-semibold"
        style={{ color: colors.textSecondary }}
      >
        {targetCurrency}
      </Text>
    </View>
  );
}

function TableRowItem({
  row,
  baseCurrency,
  targetCurrency,
  isEven,
}: {
  row: TableRow;
  baseCurrency: string;
  targetCurrency: string;
  isEven: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center px-5 py-3.5"
      style={{
        backgroundColor: isEven ? colors.surfaceSecondary : "transparent",
      }}
    >
      <View className="flex-1 flex-row items-baseline">
        <Text className="text-xs" style={{ color: colors.textTertiary }}>
          {getCurrencySymbol(baseCurrency)}{" "}
        </Text>
        <Text
          className="text-xl font-bold"
          style={{ color: colors.text }}
        >
          {formatCurrencyValue(row.baseValue, baseCurrency)}
        </Text>
      </View>
      <Text
        className="mx-3 text-base"
        style={{ color: colors.textTertiary }}
      >
        →
      </Text>
      <View className="flex-1 flex-row items-baseline justify-end">
        <Text className="text-xs" style={{ color: colors.textTertiary }}>
          {getCurrencySymbol(targetCurrency)}{" "}
        </Text>
        <Text
          className="text-xl font-bold"
          style={{ color: colors.primary }}
        >
          {row.targetValue}
        </Text>
      </View>
    </View>
  );
}

export function ConversionTable({
  baseCurrency,
  targetCurrency,
  rows,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      className="mx-5 mt-4 overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.surface }}
    >
      <TableHeader
        baseCurrency={baseCurrency}
        targetCurrency={targetCurrency}
      />
      <FlatList
        data={rows}
        scrollEnabled={false}
        keyExtractor={(item) => item.baseValue.toString()}
        renderItem={({ item, index }) => (
          <TableRowItem
            row={item}
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
            isEven={index % 2 === 0}
          />
        )}
      />
    </View>
  );
}
