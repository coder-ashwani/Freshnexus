import type { CurrencyRates } from "@/types";

const BASE = "https://api.frankfurter.app";

// Currencies we care about for the insights page
export const TRACKED_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD"];

export async function getLatestRates(base = "USD"): Promise<CurrencyRates> {
  const symbols = TRACKED_CURRENCIES.filter((c) => c !== base).join(",");
  const url = `${BASE}/latest?from=${base}&symbols=${symbols}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // currency: refresh hourly
  });

  if (!res.ok) throw new Error(`Frankfurter API failed: ${res.status}`);
  return res.json();
}

export async function getCurrencyHistory(
  base = "USD",
  symbol = "EUR",
  daysBack = 7
): Promise<{ date: string; rate: number }[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysBack);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const url = `${BASE}/${fmt(start)}..${fmt(end)}?from=${base}&symbols=${symbol}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  return Object.entries(data.rates as Record<string, Record<string, number>>).map(([date, pair]) => ({
    date,
    rate: pair[symbol],
  }));
}
