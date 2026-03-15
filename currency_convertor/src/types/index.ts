export interface CurrencyPair {
  base: string;
  target: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export interface CachedRateData {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number;
  apiDate: string;
}

export interface RateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrencyList {
  [code: string]: string;
}
