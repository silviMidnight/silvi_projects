import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCurrencyStore } from "@/store/currencyStore";
import { useTheme } from "@/hooks/useTheme";
import { CurrencySelector } from "@/components/CurrencySelector";
import { getCurrencyInfo } from "@/utils/currencies";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: string }[] = [
  { value: "system", label: "System", icon: "phone-portrait-outline" },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
];

function SettingsRow({
  label,
  value,
  onPress,
  icon,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4"
      disabled={!onPress}
    >
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: colors.primaryMuted }}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text className="flex-1 text-base" style={{ color: colors.text }}>
        {label}
      </Text>
      <Text className="mr-1 text-sm" style={{ color: colors.textSecondary }}>
        {value}
      </Text>
      {onPress && (
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      )}
    </Pressable>
  );
}

function SettingsToggleRow({
  label,
  value,
  onToggle,
  icon,
}: {
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center px-5 py-4">
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: colors.primaryMuted }}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text className="flex-1 text-base" style={{ color: colors.text }}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return (
    <View
      className="ml-16 h-px"
      style={{ backgroundColor: colors.border }}
    />
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();

  const homeCurrency = useCurrencyStore((s) => s.homeCurrency);
  const theme = useCurrencyStore((s) => s.theme);
  const autoRefresh = useCurrencyStore((s) => s.autoRefresh);
  const setHomeCurrency = useCurrencyStore((s) => s.setHomeCurrency);
  const setTheme = useCurrencyStore((s) => s.setTheme);
  const setAutoRefresh = useCurrencyStore((s) => s.setAutoRefresh);

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const homeInfo = getCurrencyInfo(homeCurrency);
  const themeLabel =
    THEME_OPTIONS.find((o) => o.value === theme)?.label ?? "System";

  const handleCurrencySelect = useCallback(
    (code: string) => {
      setHomeCurrency(code);
      setShowCurrencyPicker(false);
    },
    [setHomeCurrency]
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top"]}
    >
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 px-5">
          <Text
            className="mb-2 text-sm font-semibold uppercase tracking-wider"
            style={{ color: colors.textSecondary }}
          >
            Preferences
          </Text>
        </View>

        <View
          className="mx-5 overflow-hidden rounded-2xl"
          style={{ backgroundColor: colors.surface }}
        >
          <SettingsRow
            label="Home Currency"
            value={`${homeCurrency} — ${homeInfo.name}`}
            onPress={() => setShowCurrencyPicker(true)}
            icon="wallet-outline"
          />
          <Divider />
          <SettingsRow
            label="Theme"
            value={themeLabel}
            onPress={() => setShowThemePicker(true)}
            icon="color-palette-outline"
          />
          <Divider />
          <SettingsToggleRow
            label="Auto-refresh rates"
            value={autoRefresh}
            onToggle={setAutoRefresh}
            icon="refresh-outline"
          />
        </View>

        <View className="mt-8 px-5">
          <Text
            className="mb-2 text-sm font-semibold uppercase tracking-wider"
            style={{ color: colors.textSecondary }}
          >
            About
          </Text>
        </View>

        <View
          className="mx-5 overflow-hidden rounded-2xl"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row items-center px-5 py-4">
            <View
              className="mr-3 h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: colors.primaryMuted }}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <Text className="flex-1 text-base" style={{ color: colors.text }}>
              Version
            </Text>
            <Text
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              1.0.0
            </Text>
          </View>
          <Divider />
          <View className="flex-row items-center px-5 py-4">
            <View
              className="mr-3 h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: colors.primaryMuted }}
            >
              <Ionicons
                name="globe-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base" style={{ color: colors.text }}>
                Data Source
              </Text>
              <Text
                className="mt-0.5 text-xs"
                style={{ color: colors.textSecondary }}
              >
                European Central Bank via Frankfurter API
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showCurrencyPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <SafeAreaView
          className="flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <View className="flex-row items-center justify-between px-5 py-3">
            <Text
              className="text-lg font-bold"
              style={{ color: colors.text }}
            >
              Home Currency
            </Text>
            <Pressable onPress={() => setShowCurrencyPicker(false)}>
              <Text className="text-base" style={{ color: colors.primary }}>
                Cancel
              </Text>
            </Pressable>
          </View>
          <CurrencySelector
            selected={homeCurrency}
            onSelect={handleCurrencySelect}
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showThemePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemePicker(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowThemePicker(false)}
        >
          <View
            className="w-72 overflow-hidden rounded-2xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="px-5 pb-2 pt-4">
              <Text
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                Theme
              </Text>
            </View>
            {THEME_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  setTheme(option.value);
                  setShowThemePicker(false);
                }}
                className="flex-row items-center px-5 py-3.5"
              >
                <Ionicons
                  name={option.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={
                    theme === option.value
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  className="ml-3 flex-1 text-base"
                  style={{
                    color:
                      theme === option.value ? colors.primary : colors.text,
                    fontWeight: theme === option.value ? "600" : "400",
                  }}
                >
                  {option.label}
                </Text>
                {theme === option.value && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            ))}
            <View className="h-3" />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
