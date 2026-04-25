"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "flex-start",
      paddingTop: "15vh"
    }} onClick={() => setIsOpen(false)}>
      
      <div style={{
        width: "90%", maxWidth: "600px", background: "var(--surface)",
        borderRadius: "12px", border: "1px solid var(--surface-border)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)", overflow: "hidden"
      }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: "flex", alignItems: "center", padding: "1rem", borderBottom: "1px solid var(--surface-border)" }}>
          <span style={{ marginRight: "1rem", opacity: 0.5 }}>🔍</span>
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search groceries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none", color: "var(--text-primary)",
              fontSize: "1.1rem", outline: "none"
            }}
          />
          <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem", padding: "4px 8px", backgroundBlendMode: "overlay", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "4px" }}>
            ESC
          </button>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0.5rem" }}>
          {loading && <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Searching...</div>}
          
          {!loading && query && results.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No results found for "{query}"</div>
          )}

          {!loading && results.map((product) => (
            <div 
              key={product.code}
              onClick={() => {
                setIsOpen(false);
                router.push(`/product/${product.code}`);
              }}
              style={{
                display: "flex", alignItems: "center", padding: "0.75rem", gap: "1rem",
                borderRadius: "8px", cursor: "pointer", transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {product.image_front_small_url ? (
                <div style={{ width: "40px", height: "40px", position: "relative", borderRadius: "6px", overflow: "hidden", backgroundColor: "white" }}>
                  <Image src={product.image_front_small_url} alt="" fill style={{ objectFit: "contain" }} unoptimized />
                </div>
              ) : (
                <div style={{ width: "40px", height: "40px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>🛒</div>
              )}
              <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem" }}>{product.product_name}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{product.brands?.split(",")[0] || "Unknown Brand"}</p>
              </div>
            </div>
          ))}

          {!query && (
            <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5, fontSize: "0.85rem" }}>
              Start typing to search globally...
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
