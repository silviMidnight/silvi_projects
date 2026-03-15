import type { CurrencyInfo } from "../types";

export const CURRENCIES: CurrencyInfo[] = [
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Renminbi Yuan", symbol: "¥" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];

const SUPPORTED_CODES = new Set(CURRENCIES.map((c) => c.code));

const currencyMap = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrencyInfo(code: string): CurrencyInfo {
  return currencyMap.get(code) ?? { code, name: code, symbol: code };
}

export function getCurrencySymbol(code: string): string {
  return getCurrencyInfo(code).symbol;
}

export function isSupportedCurrency(code: string): boolean {
  return SUPPORTED_CODES.has(code);
}

export function toSupportedCurrency(code: string): string {
  if (SUPPORTED_CODES.has(code)) return code;
  return "EUR";
}

export function searchCurrencies(query: string): CurrencyInfo[] {
  if (!query.trim()) return CURRENCIES;
  const q = query.toLowerCase().trim();
  return CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
  );
}
