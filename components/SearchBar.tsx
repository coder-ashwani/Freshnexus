"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentCat = searchParams.get("category") ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (currentCat) params.set("category", currentCat);
    startTransition(() => router.push(`/?${params.toString()}`));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="search-form"
      role="search"
      aria-label="Search grocery products"
    >
      <div className="search-input-wrap">
        {/* Search icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          id="product-search"
          type="search"
          className="search-input"
          defaultValue={currentQ}
          placeholder="Search oat milk, pasta, olive oil…"
          aria-label="Search products"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <button
        type="submit"
        className="search-btn"
        disabled={isPending}
        aria-label="Search"
        id="search-submit-btn"
      >
        {isPending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
