import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  Animated,
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
import { usePressAnimation } from "../hooks/usePressAnimation";

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
  rowHeight,
  isExpanded,
  onToggle,
}: {
  baseValue: number;
  substep: number;
  rate: number | null;
  isEven: boolean;
  dividerColor: string;
  rowHeight: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { colors } = useTheme();
  const rowAnim = usePressAnimation(0.97);

  const convertedValue =
    rate != null ? formatTableConverted(baseValue * rate) : "—";

  const subValues = isExpanded ? getSubValues(baseValue, substep) : [];

  return (
    <View>
      <Animated.View style={{ transform: [{ scale: rowAnim.scale }] }}>
        <Pressable
          onPress={onToggle}
          onPressIn={rowAnim.onPressIn}
          onPressOut={rowAnim.onPressOut}
          className="flex-row"
          style={{
            height: rowHeight,
            backgroundColor: isEven ? colors.surfaceSecondary : "transparent",
          }}
        >
          <View className="flex-1 items-end justify-center pl-2 pr-5">
            <Text
              className={isExpanded ? "text-2xl font-extrabold" : "text-xl font-bold"}
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
          <View className="flex-1 items-start justify-center pl-5 pr-2">
            <Text
              className={isExpanded ? "text-2xl font-extrabold" : "text-xl font-bold"}
              style={{ color: colors.primary }}
            >
              {convertedValue}
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      {isExpanded && (
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
                <View className="flex-1 items-end justify-center py-1.5 pl-2 pr-4">
                  <Text
                    className="text-base font-semibold"
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
                <View className="flex-1 items-start justify-center py-1.5 pl-4 pr-2">
                  <Text
                    className="text-base font-semibold"
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
    <View className="flex-row items-center justify-center gap-1 py-1">
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

function PageContent({
  page,
  pageIndex,
  pageWidth,
  rowHeight,
  rate,
  dividerColor,
  expandedKey,
  onToggleRow,
}: {
  page: TablePage;
  pageIndex: number;
  pageWidth: number;
  rowHeight: number;
  rate: number | null;
  dividerColor: string;
  expandedKey: string | null;
  onToggleRow: (key: string) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);

  const expandedRowIndex = expandedKey?.startsWith(`${pageIndex}-`)
    ? parseInt(expandedKey.split("-")[1], 10)
    : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (expandedRowIndex != null) {
        scrollRef.current?.scrollTo({
          y: expandedRowIndex * rowHeight,
          animated: true,
        });
      } else {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [expandedRowIndex, rowHeight]);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ width: pageWidth }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      nestedScrollEnabled
    >
      {page.values.map((value, rowIndex) => {
        const key = `${pageIndex}-${rowIndex}`;
        return (
          <ExpandableRow
            key={value}
            baseValue={value}
            substep={page.substep}
            rate={rate}
            isEven={rowIndex % 2 === 0}
            dividerColor={dividerColor}
            rowHeight={rowHeight}
            isExpanded={expandedKey === key}
            onToggle={() => onToggleRow(key)}
          />
        );
      })}
    </ScrollView>
  );
}

export function ConversionTable({
  baseCurrency,
  targetCurrency,
  rate,
}: Props) {
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const listRef = useRef<FlatList<TablePage>>(null);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPageWidth(Math.floor(width));
    setRowHeight(Math.floor(height / 10));
  }, []);

  const handleToggleRow = useCallback((key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedKey((prev) => (prev === key ? null : key));
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentPage(viewableItems[0].index);
        setExpandedKey(null);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const currentLabel = TABLE_PAGES[currentPage]?.label ?? "";
  const dividerColor = colors.tableDivider;

  const renderPage = useCallback(
    ({ item: page, index: pageIndex }: { item: TablePage; index: number }) => (
      <PageContent
        page={page}
        pageIndex={pageIndex}
        pageWidth={pageWidth}
        rowHeight={rowHeight}
        rate={rate}
        dividerColor={dividerColor}
        expandedKey={expandedKey}
        onToggleRow={handleToggleRow}
      />
    ),
    [pageWidth, rowHeight, rate, dividerColor, expandedKey, handleToggleRow]
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
      className="mx-5 mt-2 flex-1 overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.surface }}
    >
      <View
        className="flex-row"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-1 items-center py-2">
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
        <View className="flex-1 items-center py-2">
          <Text
            className="text-base font-bold uppercase tracking-wider"
            style={{ color: colors.primary }}
          >
            {targetCurrency}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }} onLayout={handleLayout}>
        {pageWidth > 0 && rowHeight > 0 && (
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
            style={{ flex: 1 }}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={3}
            decelerationRate="fast"
            snapToAlignment="start"
            snapToInterval={pageWidth}
            disableIntervalMomentum
          />
        )}
      </View>

      <View className="pb-1.5 pt-0.5">
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
