# Travel Currency Converter

A fast, minimal currency converter designed for travelers. Instantly understand foreign prices in your home currency.

## Tech Stack

- **React Native** with **Expo** (SDK 55)
- **TypeScript** (strict mode)
- **Expo Router** — file-based navigation
- **NativeWind** (Tailwind CSS) — styling
- **Zustand** — state management with AsyncStorage persistence
- **TanStack Query** — data fetching with stale-while-revalidate caching
- **Frankfurter API** — exchange rates from the European Central Bank

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then scan the QR code with Expo Go (Android) or Camera app (iOS).

## Project Structure

```
app/                    File-based routes (Expo Router)
├── (tabs)/             Tab navigation group
│   ├── index.tsx       Converter screen (main)
│   ├── favorites.tsx   Saved & recent pairs
│   └── settings.tsx    App preferences
├── rate-details.tsx    Rate detail modal
└── currency-select.tsx Currency picker modal

src/
├── components/         Reusable UI components
├── hooks/              Custom React hooks
├── services/           API integration layer
├── store/              Zustand state management
├── types/              TypeScript type definitions
└── utils/              Formatting, currency data, table scaling
```

## Features

- Smart conversion table with dynamic scaling
- Instant custom amount conversion
- One-tap currency swap
- Favorite currency pairs
- Recent pairs history
- Offline fallback with cached rates
- Dark mode support
- Home currency auto-detection from device locale

## API

Exchange rates are provided by the [Frankfurter API](https://frankfurter.dev/) sourcing data from the European Central Bank. 31 major currencies are supported. Rates update daily.
