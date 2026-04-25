# FreshNexus — Grocery Intelligence Platform

A **Next.js 15 App Router** web application providing grocery product discovery, deep product intelligence, and live market insights.

## Live Demo

> Deploy to Vercel: Click **"New Project"** → Import this repo → Deploy (zero config needed).

---

## Pages

| Page | Route | Description |
|---|---|---|
| Discovery Hub | `/` | Searchable catalog via Open Food Facts, URL-based category filtering |
| Product Intelligence | `/product/[id]` | Deep-dive product detail with dynamic SEO + nutrition data |
| Market Insights | `/insights` | Live currency rates (Frankfurter) + grocery market context |

---

## Architectural Choices

### SEO Strategy

**Server Components as the default.** All three pages are React Server Components. This means the HTML delivered to the browser (and to crawlers) already contains the product names, descriptions, and nutrition data — no JavaScript execution needed for indexing.

**Dynamic `generateMetadata`** is used on the Product Detail page to produce per-product `<title>`, `<meta description>`, and OpenGraph tags based on the actual product name fetched from the API. This ensures every product page has unique, meaningful metadata rather than a generic placeholder.

**Semantic HTML** is used throughout: `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<nav>`, `<dl>` for definition lists, and `<table>` for nutrition data. `aria-*` attributes are applied to interactive elements for accessibility (which also benefits crawlers).

**URL-based state** for search, category, and pagination — all filter state lives in the URL (`?q=&category=&page=`). This means every filtered view is a standalone shareable, indexable URL.

### Data Fetching & Caching

| Strategy | Used for | Rationale |
|---|---|---|
| `fetch` + `next: { revalidate: 300 }` | Home page search | Product catalog changes infrequently; 5-min ISR balances freshness vs. API load |
| `fetch` + `next: { revalidate: 3600 }` | Product detail + currency rates | Individual product data is stable; currency updates daily |
| No `"use client"` on data pages | All 3 pages | Ensures server-rendered HTML for SEO; client components only for interactive UI |

This pattern (ISR — Incremental Static Regeneration) means pages are statically served from the CDN edge and only re-fetched from the origin when the revalidation window expires, providing both **performance** and **data freshness**.

### Image Handling

`next/image` is used on every product photo with:
- `fill` layout + `object-fit: contain` for responsive aspect-ratio boxes
- `sizes` attribute on list cards to serve appropriately-sized WebP images
- `priority` on the above-the-fold product detail image
- `unoptimized` flag used since Open Food Facts images are already optimized JPEGs served from their CDN

### APIs

| API | Endpoint | No API Key? |
|---|---|---|
| [Open Food Facts](https://world.openfoodfacts.org) | `/api/v2/search`, `/api/v2/product/{code}` | ✅ Fully public |
| [Frankfurter](https://www.frankfurter.app) | `/latest`, `/{start}..{end}` | ✅ Fully public, ECB data |

Both APIs are completely free, require no authentication, and are appropriate for production use with attribution (provided in the footer).

---

## Tech Stack

- **Next.js 15** — App Router, Server Components, ISR
- **TypeScript** — Full type safety across API responses
- **Vanilla CSS** — Custom design system (no Tailwind/CSS-in-JS), dark theme, glassmorphism
- **`next/image`** — Optimized image delivery

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build   # type-check + build
npm start       # production server
```

For Vercel: just push to GitHub and import the repo — zero additional configuration needed.
