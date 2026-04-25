"use client";

import { useEffect, useState } from "react";

interface Commodity {
  symbol: string;
  name: string;
  price: number;
  change: number;
  unit: string;
  flash: "up" | "down" | null;
}

const INITIAL_COMMODITIES: Commodity[] = [
  { symbol: "WHEAT", name: "Wheat Futures", price: 540.25, change: 0, unit: "USd/bu", flash: null },
  { symbol: "CORN", name: "Corn Futures", price: 425.50, change: 0, unit: "USd/bu", flash: null },
  { symbol: "COFFEE", name: "Coffee 'C'", price: 184.15, change: 0, unit: "USd/lb", flash: null },
  { symbol: "SUGAR", name: "Sugar #11", price: 21.82, change: 0, unit: "USd/lb", flash: null },
  { symbol: "COCOA", name: "Cocoa", price: 9540.00, change: 0, unit: "USD/T", flash: null },
  { symbol: "SOYBEAN", name: "Soybeans", price: 1150.75, change: 0, unit: "USd/bu", flash: null },
];

export default function LiveCommoditiesTicker() {
  const [commodities, setCommodities] = useState<Commodity[]>(INITIAL_COMMODITIES);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCommodities(prev => 
        prev.map(item => {

          if (Math.random() > 0.4) {
            return { ...item, flash: null };
          }

          const volatility = item.price * 0.003;
          const delta = (Math.random() * volatility) - (volatility / 2);
          
          const newPrice = item.price + delta;
          const newChange = item.change + delta;
          
          return {
            ...item,
            price: newPrice,
            change: newChange,
            flash: delta >= 0 ? "up" : "down"
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch on the server

  return (
    <section aria-labelledby="live-ticker-heading" style={{ marginBottom: "3rem" }}>
      <div className="section-header">
        <h2 className="section-title" id="live-ticker-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="live-dot" style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#ff4d4f", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></span>
          Live Global Commodities (Seconds)
        </h2>
        <p className="result-count" aria-live="polite">
          High-frequency trading simulated tape
        </p>
      </div>

      <div className="insights-grid">
        {commodities.map((item) => {
          const isUp = item.change >= 0;
          return (
            <article 
              key={item.symbol} 
              className={`currency-card ${item.flash ? `flash-${item.flash}` : ""}`}
              style={{
                transition: "background-color 0.3s ease",
                backgroundColor: item.flash === "up" ? "rgba(34, 197, 94, 0.15)" : item.flash === "down" ? "rgba(239, 68, 68, 0.15)" : "var(--surface)",
                borderColor: item.flash === "up" ? "rgba(34, 197, 94, 0.4)" : item.flash === "down" ? "rgba(239, 68, 68, 0.4)" : "var(--surface-border)"
              }}
            >
              <div className="currency-card__pair" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.name}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.symbol}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "1rem" }}>
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
                    {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="currency-card__label">{item.unit}</div>
                </div>
                <div style={{ 
                  color: isUp ? "#4ade80" : "#f87171",
                  fontWeight: "600",
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}>
                  {isUp ? "↑" : "↓"} {Math.abs(item.change).toFixed(2)}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
        }
      `}</style>
    </section>
  );
}
