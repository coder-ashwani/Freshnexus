import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "@/lib/openfoodfacts";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Discovery Hub — Explore Grocery Products",
  description:
    "Search and browse thousands of grocery products worldwide. Filter by category, check Nutri-Scores, and discover what's in your food.",
  openGraph: {
    title: "FreshNexus Discovery Hub — Explore Grocery Products",
    description:
      "Search and browse thousands of grocery products worldwide.",
  },
};

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function DiscoveryHub({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const category = params.category ?? "";
  const page = Math.max(1, Number(params.page ?? 1));

  // searchProducts never throws — it returns empty results on API failures
  const data = await searchProducts({ query, category, page });

  const products = data.products ?? [];
  const count = data.count ?? 0;
  const pageCount = data.page_count ?? 1;


  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero__eyebrow" aria-hidden="true">
            <span>🌍</span> Powered by Open Food Facts
          </div>
          <h1 className="hero__title" id="hero-title">
            Explore the World&rsquo;s{" "}
            <span className="gradient-text">Grocery Intelligence</span>
          </h1>
          <p className="hero__subtitle">
            Search millions of food products, decode nutrition labels, and make
            smarter choices every day.
          </p>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Category filter */}
      <Suspense>
        <CategoryFilter />
      </Suspense>

      {/* Products grid */}
      <section className="products-section" aria-label="Product results">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {query
                ? `Results for "${query}"`
                : category
                ? category.replace(/-and-/g, " & ").replace(/-/g, " ")
                : "Popular Products"}
            </h2>
            {count > 0 && (
              <p className="result-count" aria-live="polite">
                {count.toLocaleString()} products found
              </p>
            )}
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <p className="empty-state__title">No products found</p>
              <p className="empty-state__text">
                {query
                  ? `No results for "${query}". Try a different search term.`
                  : "Try selecting a different category."}
              </p>
            </div>
          ) : (
            <div className="product-grid" role="list" aria-label="Products">
              {products.map((product) => (
                <div key={product.code} role="listitem">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <Suspense>
            <Pagination currentPage={page} pageCount={pageCount} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
