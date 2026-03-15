export interface TablePage {
  label: string;
  values: number[];
  substep: number;
}

function range(start: number, step: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => start + step * i);
}

export const TABLE_PAGES: TablePage[] = [
  { label: "1 – 10", values: range(1, 1, 10), substep: 0.1 },
  { label: "10 – 100", values: range(10, 10, 10), substep: 1 },
  { label: "100 – 1K", values: range(100, 100, 10), substep: 10 },
  { label: "1K – 10K", values: range(1_000, 1_000, 10), substep: 100 },
  { label: "10K – 100K", values: range(10_000, 10_000, 10), substep: 1_000 },
  { label: "100K – 1M", values: range(100_000, 100_000, 10), substep: 10_000 },
  { label: "1M – 10M", values: range(1_000_000, 1_000_000, 10), substep: 100_000 },
  { label: "10M – 100M", values: range(10_000_000, 10_000_000, 10), substep: 1_000_000 },
  { label: "100M – 1B", values: range(100_000_000, 100_000_000, 10), substep: 10_000_000 },
  { label: "1B – 10B", values: range(1_000_000_000, 1_000_000_000, 10), substep: 100_000_000 },
  { label: "10B – 100B", values: range(10_000_000_000, 10_000_000_000, 10), substep: 1_000_000_000 },
];

export function getSubValues(value: number, substep: number): number[] {
  return Array.from(
    { length: 9 },
    (_, i) => Math.round((value + substep * (i + 1)) * 100) / 100
  );
}

export function formatBaseValue(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return Number.isInteger(b) ? `${b}B` : `${b.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
