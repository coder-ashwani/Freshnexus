"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const [placed, setPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0); // e.g. 0.10 for 10%
  const [promoError, setPromoError] = useState("");
  
  // Hardcoded delivery charge based on the project requirements
  const deliveryFee = 5.00;
  
  // Apply discount and calculate final
  const discountAmount = cartTotal * discount;
  const subtotalAfterDiscount = cartTotal - discountAmount;
  const finalTotal = subtotalAfterDiscount + (items.length > 0 ? deliveryFee : 0);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "FRESH10") {
      setDiscount(0.10);
      setPromoError("");
    } else if (code === "WELCOME20") {
      setDiscount(0.20);
      setPromoError("");
    } else if (code !== "") {
      setDiscount(0);
      setPromoError("Invalid or expired promo code");
    } else {
      setDiscount(0);
      setPromoError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to success screen
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="container" style={{ paddingTop: "6rem", paddingBottom: "4rem", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Order Confirmed!</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "500px", marginBottom: "2rem" }}>
          Thank you for shopping with FreshNexus. Your fresh groceries are being prepared and will be delivered to your address shortly.
        </p>
        <Link href="/" style={{ background: "var(--accent)", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Secure Checkout</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)", gap: "2rem", alignItems: "start" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <form id="checkout-form" onSubmit={handleSubmit} style={{ background: "var(--surface)", border: "1px solid var(--surface-border)", borderRadius: "12px", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--surface-border)", paddingBottom: "0.75rem" }}>
              Shipping Address
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>First Name</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="John" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Last Name</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="Doe" />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Street Address</label>
              <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="123 Fresh Lane" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>City</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="San Francisco" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>State</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="CA" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>ZIP Code</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="94105" />
              </div>
            </div>

            <h2 style={{ fontSize: "1.25rem", margin: "2rem 0 1.5rem", borderBottom: "1px solid var(--surface-border)", paddingBottom: "0.75rem" }}>
              Payment Details
            </h2>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Card Number</label>
              <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="0000 0000 0000 0000" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Expiry Date</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="MM/YY" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>CVC</label>
                <input required type="text" style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.75rem", borderRadius: "6px" }} placeholder="123" />
              </div>
            </div>
          </form>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--surface-border)", borderRadius: "12px", padding: "2rem", position: "sticky", top: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--surface-border)", paddingBottom: "0.75rem" }}>
            Order Summary
          </h2>

          {items.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>Your cart is empty.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {items.map((item) => (
                <div key={item.product.code} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                   {item.product.image_front_small_url ? (
                     <img src={item.product.image_front_small_url} alt="" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />
                   ) : (
                     <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>🛒</div>
                   )}
                   <div style={{ flex: 1 }}>
                     <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{item.product.product_name}</h4>
                     <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                   </div>
                   <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                     ${(item.price * item.quantity).toFixed(2)}
                   </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: "1rem 0", borderTop: "1px solid var(--surface-border)" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Gift Card or Promo Code</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ flex: 1, background: "var(--bg-1)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.5rem 0.75rem", borderRadius: "6px" }} 
                placeholder="FRESH10 or WELCOME20" 
              />
              <button 
                type="button"
                onClick={handleApplyPromo}
                style={{ background: "rgba(0,0,0,0.05)", border: "1px solid var(--border-bright)", color: "var(--text-primary)", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
              >
                Apply
              </button>
            </div>
            {promoError && <p style={{ color: "var(--accent-red)", fontSize: "0.8rem", marginTop: "0.5rem" }}>{promoError}</p>}
            {discount > 0 && <p style={{ color: "#10b981", fontSize: "0.8rem", marginTop: "0.5rem", fontWeight: "600" }}>✓ Promo code applied!</p>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid var(--surface-border)", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.95rem" }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontSize: "0.95rem" }}>
                <span>Discount ({(discount * 100)}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.95rem" }}>
              <span>Delivery Charge</span>
              <span>{items.length > 0 ? `$${deliveryFee.toFixed(2)}` : "$0.00"}</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--surface-border)", paddingTop: "1.5rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>Final Total</span>
            <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--accent-2)" }}>${finalTotal.toFixed(2)}</span>
          </div>

          <button 
            type="submit"
            form="checkout-form"
            disabled={items.length === 0}
            style={{
              width: "100%", background: items.length > 0 ? "var(--accent)" : "rgba(255,255,255,0.1)", color: "white",
              border: "none", padding: "1rem", borderRadius: "8px", fontWeight: "700", fontSize: "1.1rem",
              cursor: items.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s"
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
