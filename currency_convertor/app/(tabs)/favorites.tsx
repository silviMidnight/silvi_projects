import { useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  Pressable,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCurrencyStore } from "@/store/currencyStore";
import { useTheme } from "@/hooks/useTheme";
import { usePressAnimation } from "@/hooks/usePressAnimation";
import { FavoritePairCard } from "@/components/FavoritePairCard";
import { EmptyState } from "@/components/EmptyState";
import type { CurrencyPair } from "@/types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function RecentPairRow({
  pair,
  onPress,
}: {
  pair: CurrencyPair;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const anim = usePressAnimation(0.97);

  return (
    <Animated.View style={{ transform: [{ scale: anim.scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={anim.onPressIn}
        onPressOut={anim.onPressOut}
        className="flex-row items-center px-5 py-3.5"
        accessibilityLabel={`${pair.base} to ${pair.target}`}
      >
        <View
          className="mr-3 h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={colors.textTertiary}
          />
        </View>
        <Text
          className="text-base font-medium"
          style={{ color: colors.text }}
        >
          {pair.base}
        </Text>
        <Ionicons
          name="arrow-forward"
          size={14}
          color={colors.textTertiary}
          style={{ marginHorizontal: 6 }}
        />
        <Text
          className="text-base font-medium"
          style={{ color: colors.text }}
        >
          {pair.target}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const favoritePairs = useCurrencyStore((s) => s.favoritePairs);
  const recentPairs = useCurrencyStore((s) => s.recentPairs);
  const removeFavorite = useCurrencyStore((s) => s.removeFavorite);
  const setBaseCurrency = useCurrencyStore((s) => s.setBaseCurrency);
  const setTargetCurrency = useCurrencyStore((s) => s.setTargetCurrency);
  const cachedRates = useCurrencyStore((s) => s.cachedRates);

  const navigateToPair = useCallback(
    (pair: CurrencyPair) => {
      setBaseCurrency(pair.base);
      setTargetCurrency(pair.target);
      router.push("/(tabs)");
    },
    [setBaseCurrency, setTargetCurrency, router]
  );

  const handleRemoveFavorite = useCallback(
    (pair: CurrencyPair) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      removeFavorite(pair);
    },
    [removeFavorite]
  );

  const getRateForPair = (pair: CurrencyPair): number | null => {
    const cached = cachedRates[pair.base];
    if (!cached) return null;
    return cached.rates[pair.target] ?? null;
  };

  const hasFavorites = favoritePairs.length > 0;
  const hasRecents = recentPairs.length > 0;

  if (!hasFavorites && !hasRecents) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="px-5 pb-2 pt-4">
          <Text
            className="text-2xl font-bold"
            style={{ color: colors.text }}
          >
            Favorites
          </Text>
        </View>
        <EmptyState
          icon="star-outline"
          title="No favorites yet"
          subtitle="Tap the star on the converter screen to save currency pairs"
        />
      </SafeAreaView>
    );
  }

  type SectionItem =
    | { type: "favorite"; pair: CurrencyPair }
    | { type: "recent"; pair: CurrencyPair };

  const sections: { title: string; data: SectionItem[] }[] = [];

  if (hasFavorites) {
    sections.push({
      title: "Favorites",
      data: favoritePairs.map((pair) => ({ type: "favorite" as const, pair })),
    });
  }

  if (hasRecents) {
    sections.push({
      title: "Recent",
      data: recentPairs.map((pair) => ({ type: "recent" as const, pair })),
    });
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top"]}
    >
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Favorites
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          `${item.type}-${item.pair.base}-${item.pair.target}-${index}`
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        renderSectionHeader={({ section }) => (
          <View
            className="px-5 pb-2 pt-5"
            style={{ backgroundColor: colors.background }}
          >
            <Text
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.textSecondary }}
            >
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          if (item.type === "favorite") {
            return (
              <View className="px-5 pb-2">
                <FavoritePairCard
                  pair={item.pair}
                  rate={getRateForPair(item.pair)}
                  onPress={() => navigateToPair(item.pair)}
                  onDelete={() => handleRemoveFavorite(item.pair)}
                />
              </View>
            );
          }
          return (
            <RecentPairRow
              pair={item.pair}
              onPress={() => navigateToPair(item.pair)}
            />
          );
        }}
        ItemSeparatorComponent={({ section }) =>
          section.title === "Recent" ? (
            <View
              className="ml-16 h-px"
              style={{ backgroundColor: colors.border }}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
