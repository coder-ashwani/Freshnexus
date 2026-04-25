"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CATEGORIES } from "@/lib/openfoodfacts";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const active = searchParams.get("category") ?? "";

  function selectCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("page"); // reset to page 1 on filter change
    startTransition(() => router.push(`/?${params.toString()}`));
  }

  return (
    <nav className="category-section" aria-label="Filter by category">
      <div className="container">
        <div className="category-scroll" role="list">
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value || "all"}
              id={`category-${value || "all"}`}
              role="listitem"
              className={`category-chip${active === value ? " category-chip--active" : ""}`}
              onClick={() => selectCategory(value)}
              disabled={isPending}
              aria-pressed={active === value}
              aria-label={`Filter by ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
