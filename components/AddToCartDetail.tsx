"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/lib/CartContext";

interface AddToCartDetailProps {
  product: Product;
  price: number;
}

export default function AddToCartDetail({ product, price }: AddToCartDetailProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty, price);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    setQty(1);
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--surface-border)",
      borderRadius: "12px",
      padding: "1.25rem",
      marginTop: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Price</span>
        <span style={{ fontSize: "1.75rem", fontWeight: "700", color: "var(--text-primary)" }}>
          ${price.toFixed(2)}
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
        <div style={{
          display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between",
          background: "var(--bg-1)", border: "1px solid var(--border-bright)", borderRadius: "8px", overflow: "hidden"
        }}>
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={{ background: "transparent", border: "none", color: "var(--text-primary)", width: "40px", height: "40px", cursor: "pointer", fontSize: "1.25rem" }}
          >
            -
          </button>
          <span style={{ fontSize: "1rem", width: "30px", textAlign: "center", fontWeight: "600" }}>{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            style={{ background: "transparent", border: "none", color: "var(--text-primary)", width: "40px", height: "40px", cursor: "pointer", fontSize: "1.25rem" }}
          >
            +
          </button>
        </div>
        
        <button 
          onClick={handleAdd}
          style={{
            flex: 1,
            background: justAdded ? "#22c55e" : "var(--accent-2)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0 1rem",
            transition: "background 0.3s ease"
          }}
        >
          {justAdded ? "✓ Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
