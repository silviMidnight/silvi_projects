import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
  type LayoutChangeEvent,
  type ViewToken,
} from "react-native";
import {
  TABLE_PAGES,
  getSubValues,
  type TablePage,
} from "../utils/tableScaling";
import { useTheme } from "../hooks/useTheme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function formatTableBase(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(".", ",")}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(".", ",")}K`;
  }
  return value.toFixed(2).replace(".", ",");
}

function formatTableConverted(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2).replace(".", ",")}B`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(".", ",")}M`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(2).replace(".", ",")}K`;
  }
  return value.toFixed(2).replace(".", ",");
}

interface Props {
  baseCurrency: string;
  targetCurrency: string;
  rate: number | null;
}

function ExpandableRow({
  baseValue,
  substep,
  rate,
  isEven,
  dividerColor,
}: {
  baseValue: number;
  substep: number;
  rate: number | null;
  isEven: boolean;
  dividerColor: string;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  const convertedValue =
    rate != null ? formatTableConverted(baseValue * rate) : "—";

  const subValues = expanded ? getSubValues(baseValue, substep) : [];

  return (
    <View>
      <Pressable
        onPress={toggleExpand}
        className="flex-row"
        style={{
          backgroundColor: isEven ? colors.surfaceSecondary : "transparent",
        }}
      >
        <View className="flex-1 items-end justify-center py-3 pl-2 pr-6">
          <Text
            className={expanded ? "text-2xl font-extrabold" : "text-xl font-bold"}
            style={{ color: colors.text }}
          >
            {formatTableBase(baseValue)}
          </Text>
        </View>
        <View
          style={{
            width: 1,
            alignSelf: "stretch",
            backgroundColor: dividerColor,
          }}
        />
        <View className="flex-1 items-start justify-center py-3 pl-6 pr-2">
          <Text
            className={expanded ? "text-2xl font-extrabold" : "text-xl font-bold"}
            style={{ color: colors.primary }}
          >
            {convertedValue}
          </Text>
        </View>
      </Pressable>

      {expanded && (
        <View>
          {subValues.map((sv, idx) => {
            const subConverted =
              rate != null ? formatTableConverted(sv * rate) : "—";
            const subBg =
              idx % 2 === 0 ? colors.subRowEven : colors.subRowOdd;
            return (
              <View
                key={sv}
                className="flex-row"
                style={{ backgroundColor: subBg }}
              >
                <View className="flex-1 items-end justify-center py-2.5 pl-2 pr-4">
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.text }}
                  >
                    {formatTableBase(sv)}
                  </Text>
                </View>
                <View
                  style={{
                    width: 1,
                    alignSelf: "stretch",
                    backgroundColor: dividerColor,
                  }}
                />
                <View className="flex-1 items-start justify-center py-2.5 pl-4 pr-2">
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {subConverted}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function PageDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-center gap-1 py-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className="rounded-full"
          style={{
            width: i === current ? 16 : 6,
            height: 6,
            backgroundColor: i === current ? colors.primary : colors.border,
          }}
        />
      ))}
    </View>
  );
}

export function ConversionTable({
  baseCurrency,
  targetCurrency,
  rate,
}: Props) {
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const listRef = useRef<FlatList<TablePage>>(null);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const w = Math.floor(e.nativeEvent.layout.width);
    setPageWidth(w);
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentPage(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const currentLabel = TABLE_PAGES[currentPage]?.label ?? "";
  const dividerColor = colors.tableDivider;

  const renderPage = useCallback(
    ({ item: page }: { item: TablePage }) => (
      <View style={{ width: pageWidth }}>
        {page.values.map((value, rowIndex) => (
          <ExpandableRow
            key={value}
            baseValue={value}
            substep={page.substep}
            rate={rate}
            isEven={rowIndex % 2 === 0}
            dividerColor={dividerColor}
          />
        ))}
      </View>
    ),
    [pageWidth, rate, dividerColor]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: pageWidth,
      offset: pageWidth * index,
      index,
    }),
    [pageWidth]
  );

  return (
    <View
      className="mx-5 mt-4 overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.surface }}
      onLayout={handleLayout}
    >
      <View
        className="flex-row"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-1 items-center py-3">
          <Text
            className="text-base font-bold uppercase tracking-wider"
            style={{ color: colors.textSecondary }}
          >
            {baseCurrency}
          </Text>
        </View>
        <Text className="self-center text-xs" style={{ color: colors.textTertiary }}>
          ▶
        </Text>
        <View className="flex-1 items-center py-3">
          <Text
            className="text-base font-bold uppercase tracking-wider"
            style={{ color: colors.primary }}
          >
            {targetCurrency}
          </Text>
        </View>
      </View>

      {pageWidth > 0 && (
        <FlatList
          ref={listRef}
          data={TABLE_PAGES}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={pageWidth}
          disableIntervalMomentum
        />
      )}

      <View className="pb-2 pt-1">
        <Text
          className="text-center text-xs font-medium"
          style={{ color: colors.textTertiary }}
        >
          {currentLabel}
        </Text>
        <PageDots total={TABLE_PAGES.length} current={currentPage} />
      </View>
    </View>
  );
}
