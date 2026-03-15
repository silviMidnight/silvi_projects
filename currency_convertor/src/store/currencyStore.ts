import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toSupportedCurrency } from "../utils/currencies";
import type { CurrencyPair, CachedRateData } from "../types";

const MAX_RECENTS = 10;

interface CurrencyState {
  baseCurrency: string;
  targetCurrency: string;
  favoritePairs: CurrencyPair[];
  recentPairs: CurrencyPair[];
  homeCurrency: string;
  theme: "light" | "dark" | "system";
  autoRefresh: boolean;
  cachedRates: Record<string, CachedRateData>;
  isInitialized: boolean;

  setBaseCurrency: (code: string) => void;
  setTargetCurrency: (code: string) => void;
  swapCurrencies: () => void;
  addFavorite: (pair: CurrencyPair) => void;
  removeFavorite: (pair: CurrencyPair) => void;
  isFavorite: (pair: CurrencyPair) => boolean;
  addRecent: (pair: CurrencyPair) => void;
  setHomeCurrency: (code: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setAutoRefresh: (enabled: boolean) => void;
  updateCachedRates: (base: string, data: CachedRateData) => void;
  getCachedRate: (base: string, target: string) => number | null;
  initialize: (homeCurrency: string) => void;
}

const pairKey = (p: CurrencyPair) => `${p.base}_${p.target}`;

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      baseCurrency: "EUR",
      targetCurrency: "USD",
      favoritePairs: [],
      recentPairs: [],
      homeCurrency: "EUR",
      theme: "system",
      autoRefresh: true,
      cachedRates: {},
      isInitialized: false,

      setBaseCurrency: (code) => {
        set({ baseCurrency: code });
        const { targetCurrency, addRecent } = get();
        addRecent({ base: code, target: targetCurrency });
      },

      setTargetCurrency: (code) => {
        set({ targetCurrency: code });
        const { baseCurrency, addRecent } = get();
        addRecent({ base: baseCurrency, target: code });
      },

      swapCurrencies: () => {
        const { baseCurrency, targetCurrency } = get();
        set({ baseCurrency: targetCurrency, targetCurrency: baseCurrency });
      },

      addFavorite: (pair) =>
        set((state) => {
          const exists = state.favoritePairs.some(
            (p) => pairKey(p) === pairKey(pair)
          );
          if (exists) return state;
          return { favoritePairs: [...state.favoritePairs, pair] };
        }),

      removeFavorite: (pair) =>
        set((state) => ({
          favoritePairs: state.favoritePairs.filter(
            (p) => pairKey(p) !== pairKey(pair)
          ),
        })),

      isFavorite: (pair) => {
        return get().favoritePairs.some((p) => pairKey(p) === pairKey(pair));
      },

      addRecent: (pair) =>
        set((state) => {
          const key = pairKey(pair);
          const filtered = state.recentPairs.filter(
            (p) => pairKey(p) !== key
          );
          return {
            recentPairs: [pair, ...filtered].slice(0, MAX_RECENTS),
          };
        }),

      setHomeCurrency: (code) => set({ homeCurrency: toSupportedCurrency(code) }),

      setTheme: (theme) => set({ theme }),

      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

      updateCachedRates: (base, data) =>
        set((state) => ({
          cachedRates: { ...state.cachedRates, [base]: data },
        })),

      getCachedRate: (base, target) => {
        const cached = get().cachedRates[base];
        if (!cached) return null;
        return cached.rates[target] ?? null;
      },

      initialize: (detectedCurrency) => {
        const state = get();
        if (state.isInitialized) return;
        const home = toSupportedCurrency(detectedCurrency);
        set({
          homeCurrency: home,
          targetCurrency: home,
          baseCurrency: home === "EUR" ? "USD" : "EUR",
          isInitialized: true,
        });
      },
    }),
    {
      name: "currency-store",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        baseCurrency: state.baseCurrency,
        targetCurrency: state.targetCurrency,
        favoritePairs: state.favoritePairs,
        recentPairs: state.recentPairs,
        homeCurrency: state.homeCurrency,
        theme: state.theme,
        autoRefresh: state.autoRefresh,
        cachedRates: state.cachedRates,
        isInitialized: state.isInitialized,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const home = toSupportedCurrency(
            (state.homeCurrency as string) ?? "EUR"
          );
          const base = toSupportedCurrency(
            (state.baseCurrency as string) ?? "EUR"
          );
          const target = toSupportedCurrency(
            (state.targetCurrency as string) ?? "USD"
          );
          return { ...state, homeCurrency: home, baseCurrency: base, targetCurrency: target };
        }
        return state;
      },
    }
  )
);
