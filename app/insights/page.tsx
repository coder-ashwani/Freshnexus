import type { Metadata } from "next";
import { getLatestRates, getCurrencyHistory, TRACKED_CURRENCIES } from "@/lib/frankfurter";
import type { CurrencyRates } from "@/types";
import LiveCommoditiesTicker from "@/components/LiveCommoditiesTicker";

export const metadata: Metadata = {
  title: "Market Insights — Live Currency & Grocery Trends",
  description:
    "Live currency exchange rates powered by the European Central Bank, plus global grocery market insights and the FreshNexus mission.",
  openGraph: {
    title: "FreshNexus Market Insights — Live Currency & Grocery Trends",
    description:
      "Live currency exchange rates powered by the European Central Bank, plus global grocery market insights.",
  },
};

const GROCERY_STATS = [
  { value: "3.2M+", label: "Products in database" },
  { value: "200+", label: "Countries represented" },
  { value: "160+", label: "Currencies tracked" },
  { value: "Open", label: "Source & free to use" },
];

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", INR: "🇮🇳", AUD: "🇦🇺", CAD: "🇨🇦",
};

const CURRENCY_NAME: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound",
  JPY: "Japanese Yen", INR: "Indian Rupee", AUD: "Australian Dollar", CAD: "Canadian Dollar",
};

export default async function MarketInsights() {
  let rates: CurrencyRates | null = null;
  let rateError: string | null = null;
  let history: { date: string; rate: number }[] = [];

  try {
    rates = await getLatestRates("USD");
    history = await getCurrencyHistory("USD", "EUR", 10);
  } catch (err) {
    rateError = err instanceof Error ? err.message : "Failed to load exchange rates.";
  }

  const displayRates = TRACKED_CURRENCIES.filter((c) => c !== "USD");
  const historyMin = Math.min(...history.map((h) => h.rate));
  const historyMax = Math.max(...history.map((h) => h.rate));
  const historyRange = historyMax - historyMin || 0.001;

  return (
    <div className="insights-page">
      {/* Hero */}
      <section className="insights-hero" aria-labelledby="insights-title">
        <div className="container">
          <p className="hero__eyebrow" style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
            <span>📊</span> Live Market Data
          </p>
          <h1 className="insights-title" id="insights-title">
            Market{" "}
            <span className="gradient-text" style={{ background: "linear-gradient(135deg, var(--accent-2), var(--accent-3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Insights
            </span>
          </h1>
          <p className="insights-subtitle">
            Live currency rates from the European Central Bank, and grocery market
            intelligence from around the globe.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Stats row */}
        <section aria-labelledby="stats-heading">
          <h2 className="sr-only" id="stats-heading">Platform statistics</h2>
          <div className="stats-row">
            {GROCERY_STATS.map(({ value, label }) => (
              <div key={label} className="stat-card" role="figure" aria-label={`${value} ${label}`}>
                <div className="stat-card__value">{value}</div>
                <div className="stat-card__label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Commodities Ticker (1-2s update) */}
        <LiveCommoditiesTicker />

        {/* Currency rates */}
        <section aria-labelledby="rates-heading">
          <div className="section-header">
            <h2 className="section-title" id="rates-heading">
              Live Exchange Rates
            </h2>
            {rates?.date && (
              <p className="result-count" aria-live="polite">
                Base: USD · Updated {rates.date}
              </p>
            )}
          </div>

          {rateError ? (
            <div className="empty-state" role="alert">
              <div className="empty-state__icon">⚠️</div>
              <p className="empty-state__title">Could not load exchange rates</p>
              <p className="empty-state__text">{rateError}</p>
            </div>
          ) : (
            <div className="insights-grid" style={{ marginBottom: "2rem" }}>
              {displayRates.map((currency) => {
                const rate = rates?.rates[currency];
                if (rate == null) return null;
                return (
                  <article
                    key={currency}
                    className="currency-card"
                    aria-label={`1 USD equals ${rate.toFixed(4)} ${currency}`}
                  >
                    <div className="currency-card__pair">
                      {CURRENCY_FLAGS[currency] ?? "🌐"} {currency} · {CURRENCY_NAME[currency]}
                    </div>
                    <div className="currency-card__rate" style={{
                      background: "linear-gradient(135deg, var(--accent-2), var(--accent-3))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      {rate >= 100
                        ? rate.toFixed(2)
                        : rate >= 10
                        ? rate.toFixed(3)
                        : rate.toFixed(4)}
                    </div>
                    <div className="currency-card__label">per 1 US Dollar</div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Historical EUR/USD chart */}
        {history.length > 0 && (
          <section className="trend-section" aria-labelledby="trend-heading">
            <h2 className="trend-section__title" id="trend-heading">
              USD → EUR Rate (Last 10 days)
            </h2>
            <div className="rate-history" role="img" aria-label="Bar chart of USD to EUR exchange rate over the last 10 days">
              {history.map(({ date, rate }) => {
                const heightPct = Math.max(
                  8,
                  ((rate - historyMin) / historyRange) * 80 + 15
                );
                return (
                  <div
                    key={date}
                    className="rate-bar"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="rate-bar__tooltip">
                      {date}: {rate.toFixed(4)}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Source: Frankfurter · European Central Bank · Hover bars for exact rate
            </p>
          </section>
        )}

        {/* Grocery Market Context */}
        <section aria-labelledby="context-heading" style={{ marginBottom: "3rem" }}>
          <h2 className="section-title" id="context-heading" style={{ marginBottom: "1.25rem" }}>
            Why Currency Data Matters for Groceries
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {[
              {
                icon: "🌾",
                title: "Commodity Pricing",
                text: "Global food commodities like wheat, sugar, and soy are priced in USD. Exchange rates directly impact the cost of imported goods on your supermarket shelf.",
              },
              {
                icon: "🚢",
                title: "Supply Chain Costs",
                text: "Shipping and logistics costs fluctuate with fuel prices, which are dollar-denominated. A weaker local currency means higher import costs for food products.",
              },
              {
                icon: "📈",
                title: "Inflation Signals",
                text: "Rapid currency depreciation often precedes food inflation. Tracking these rates helps predict future grocery price movements in local markets.",
              },
            ].map(({ icon, title, text }) => (
              <article key={title} className="info-section">
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }} aria-hidden="true">{icon}</div>
                <h3 className="info-section__title" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>{title}</h3>
                <p className="info-section__text" style={{ fontSize: "0.88rem" }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="mission-block" aria-labelledby="mission-heading">
          <h2 className="mission-block__title" id="mission-heading">
            Our Mission 🥦
          </h2>
          <p className="mission-block__text">
            FreshNexus exists to make food intelligence accessible to everyone. We aggregate
            open data from the global food supply chain — nutritional facts, ingredient
            transparency, and market dynamics — so that consumers, researchers, and businesses
            can make better-informed decisions. Built on open-source data, transparent tooling,
            and a commitment to food literacy.
          </p>
        </section>

        {/* Attribution */}
        <section aria-labelledby="attribution-heading" style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2 className="sr-only" id="attribution-heading">Data attribution</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Currency data provided by{" "}
            <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)" }}>
              Frankfurter
            </a>{" "}
            (European Central Bank). Product data by{" "}
            <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              Open Food Facts
            </a>{" "}
            (ODbL licensed). Exchange rates update daily.
          </p>
        </section>
      </div>
    </div>
  );
}
