const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW", "HUF", "ISK", "IDR"]);

export function formatCurrencyValue(
  value: number,
  currencyCode: string
): string {
  if (ZERO_DECIMAL_CURRENCIES.has(currencyCode)) {
    return formatNumber(Math.round(value), 0);
  }

  if (Math.abs(value) >= 1000) {
    return formatNumber(value, 2);
  }

  if (Math.abs(value) >= 1) {
    return formatNumber(value, 2);
  }

  if (Math.abs(value) >= 0.01) {
    return formatNumber(value, 4);
  }

  return formatNumber(value, 6);
}

function formatNumber(value: number, decimals: number): string {
  const parts = value.toFixed(decimals).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toFixed(2);
  if (rate >= 1) return rate.toFixed(4);
  if (rate >= 0.01) return rate.toFixed(4);
  return rate.toFixed(6);
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
