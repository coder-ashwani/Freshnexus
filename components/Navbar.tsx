"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, items, isCartOpen, setIsCartOpen, updateQuantity, cartTotal, removeFromCart } = useCart();
  const cartRef = useRef<HTMLLIElement>(null);

  // Close cart when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
    }
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, setIsCartOpen]);

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar__inner" aria-label="Main navigation">
          <Link href="/" className="navbar__logo" aria-label="FreshNexus Home">
            🥦 FreshNexus<span className="dot">.</span>
          </Link>

          <ul className="navbar__links" role="list">
            <li>
              <Link href="/" className={`navbar__link${pathname === "/" ? " navbar__link--active" : ""}`}>
                Discovery Hub
              </Link>
            </li>
            <li>
              <Link href="/insights" className={`navbar__link${pathname === "/insights" ? " navbar__link--active" : ""}`}>
                Market Insights
              </Link>
            </li>
            <li style={{ position: "relative" }} ref={cartRef}>
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--surface-border)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span style={{
                    background: "var(--accent)",
                    color: "white",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "10px",
                    fontSize: "0.75rem"
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  marginTop: "0.5rem",
                  width: "320px",
                  background: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "12px",
                  padding: "1rem",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  zIndex: 100,
                  maxHeight: "400px",
                  overflowY: "auto"
                }}>
                  <h3 style={{ marginBottom: "1rem", fontSize: "1rem", borderBottom: "1px solid var(--surface-border)", paddingBottom: "0.5rem" }}>
                    Your Cart
                  </h3>
                  
                  {items.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>Your cart is empty.</p>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {items.map((item) => (
                          <div key={item.product.code} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                            {item.product.image_front_small_url && (
                              <img src={item.product.image_front_small_url} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                            )}
                            <div style={{ flex: 1, overflow: "hidden" }}>
                              <p style={{ fontSize: "0.85rem", fontWeight: "600", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", margin: 0 }}>
                                {item.product.product_name}
                              </p>
                              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "4px", padding: "2px" }}>
                              <button onClick={() => updateQuantity(item.product.code, item.quantity - 1)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", width: "24px" }}>-</button>
                              <span style={{ fontSize: "0.85rem", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.code, item.quantity + 1)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", width: "24px" }}>+</button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.product.code)}
                              aria-label="Remove item"
                              title="Remove completely"
                              style={{ 
                                background: "transparent", 
                                border: "none", 
                                color: "var(--text-muted)", 
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "color 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Total:</span>
                        <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "var(--accent-2)" }}>${cartTotal.toFixed(2)}</span>
                      </div>
                      <button style={{ width: "100%", background: "var(--accent)", color: "white", border: "none", padding: "0.75rem", borderRadius: "8px", marginTop: "1rem", cursor: "pointer", fontWeight: "600" }}>
                        Checkout
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
