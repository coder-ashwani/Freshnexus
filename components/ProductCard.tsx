"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import NutriScoreBadge from "./NutriScoreBadge";
import { useCart } from "@/lib/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const name = product.product_name || "Unknown Product";
  const brand = product.brands?.split(",")[0]?.trim();
  const imgSrc =
    product.image_front_small_url || product.image_url || null;

  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const rawNum = parseInt((product.code || "123").slice(-4)) || 499;
  const price = (Math.abs(rawNum) % 15) + (Math.abs(rawNum) % 99) / 100 + 1.99;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link clicking just in case
    addToCart(product, qty, price);
    setQty(1); // Reset qty after adding
  };

  return (
    <article className="product-card">
      <Link
        href={`/product/${product.code}`}
        aria-label={`View details for ${name}`}
      >
        <div className="product-card__img-wrap">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={`${name} product image`}
              fill
              sizes="(max-width: 640px) 160px, 220px"
              style={{ objectFit: "contain", padding: "8px" }}
              unoptimized
            />
          ) : (
            <div className="product-card__img-placeholder" aria-hidden="true">
              🛒
            </div>
          )}
        </div>
      </Link>

      <div className="product-card__body">
        {brand && <p className="product-card__brand">{brand}</p>}

        <Link href={`/product/${product.code}`}>
          <h2 className="product-card__name" title={name}>
            {name}
          </h2>
        </Link>
        
        <p style={{ fontWeight: "700", color: "white", fontSize: "1.1rem", margin: "0.25rem 0" }}>
          ${price.toFixed(2)}
        </p>

        <div className="product-card__meta" style={{ marginBottom: "0.75rem" }}>
          <NutriScoreBadge grade={product.nutriscore_grade} />
          {product.nova_group && (
            <span
              className="nova-badge"
              title={`NOVA Group ${product.nova_group} — processing level`}
            >
              NOVA {product.nova_group}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
          <div style={{
            display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between",
            background: "var(--bg-1)", border: "1px solid var(--border-bright)", borderRadius: "8px", overflow: "hidden"
          }}>
            <button 
              onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)); }}
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              -
            </button>
            <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{qty}</span>
            <button 
              onClick={(e) => { e.preventDefault(); setQty(qty + 1); }}
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAdd}
            style={{
              flex: 1,
              background: "var(--accent-2)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.85rem",
              padding: "0 0.5rem"
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
