// CartContext.tsx
// This file manages the global shopping cart state using React Context.
// It persists cart items to localStorage so they survive page reloads.

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, price: number) => void;
  removeFromCart: (code: string) => void;
  updateQuantity: (code: string, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("freshnexus-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("freshnexus-cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (product: Product, quantity: number, price: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.code === product.code);
      if (existing) {
        return prev.map((item) =>
          item.product.code === product.code
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, price }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (code: string) => {
    setItems((prev) => prev.filter((item) => item.product.code !== code));
  };

  const updateQuantity = (code: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(code);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.code === code ? { ...item, quantity } : item
      )
    );
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
