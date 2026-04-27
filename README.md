# FreshNexus — Grocery Intelligence Platform

A comprehensive, production-ready **Next.js 15 App Router** web application that provides seamless grocery product discovery, a fully integrated persistent shopping cart, international cross-currency checkout, and live market intelligence.

## 🚀 Live Demo-
Live Link- https://freshnexus.vercel.app/ 

---

## 🌟 Core Features

1. **Global Persistent Shopping Cart**: Utilizes React Context (`CartContext`) and `localStorage` to ensure users can add, update, and completely delete items while maintaining their cart across hard browser reloads.
2. **Live International Currency Converter**: The cart autonomously fetches real-time European Central Bank rates from the *Frankfurter API*, allowing instantaneous translation of checkout subtotals and individual product prices between USD, EUR, GBP, JPY, and INR.
3. **Cmd+K Spotlight Search**: Implemented a global, frosted-glass Modal listener that intercepts `Cmd/Ctrl + K` keystrokes anywhere on the site, fetching instant thumbnail-supported search results from a custom internal `/api/search` route.
4. **Secure Checkout Pipeline**: A gorgeous, fully responsive 2-column Checkout form that dynamically natively calculates subtotals and a fixed $5.00 delivery fee while executing rigorous field validations.
5. **Pristine Light Theme UI**: Systematically styled with CSS Variables (`var(--bg-1)`, `var(--text-primary)`) leveraging pure Vanilla CSS glassmorphism, responsive grid containers, and smooth UI Micro-interactions (e.g. visually satisfying *"✓ Added"* grid button states).
6. **Live High-Frequency Commodities**: Uses aggressive revalidation on the `/insights` page to display dynamically simulated sub-second market data, preventing stale rendering.
7. **Resilient Local Mock Fallbacks**: Automatically falls back to high-fidelity local deterministic JSON representations (`mock-grocery-data.json`) flawlessly if the external OpenFoodFacts global catalog rate-limits or times out.

---

## 🏗️ Architectural Topology

### Server Components vs Client Interactivity
- **Server Components (Default):** SEO-heavy pages like the Root Discovery Hub (`/`) and Product Intelligence detail views (`/product/[id]`) are 100% Server Side Rendered. This means the HTML payload natively embeds description tags, meta images, and data logic safely bypassing JavaScript requirements.
- **Client Components:** Dynamic features like UI interactions (`<AddToCartDetail />`, `<CommandMenu />`, `<Navbar />`) utilize specific `"use client"` boundaries guaranteeing blazing-fast interactive execution strictly where State logic is required.

### Data Fetching & Caching
| Strategy | Used for | Rationale |
|---|---|---|
| `fetch` + `next: { revalidate: 300 }` | Home page search | Product catalog changes infrequently; 5-min ISR balances freshness vs. API load |
| `fetch` + `next: { revalidate: 3600 }` | Product detail + currency rates | Individual product data is stable; currency updates daily |
| `API Route Interception` | Cmd+K Search | Optimized lightweight JSON payload streaming with debounced fetch events |

## 📦 APIs Utilized
| API | Endpoint | Usage Structure |
|---|---|---|
| **Open Food Facts** | `/api/v2/search` | Aggregates global grocery discovery data. Fully public. |
| **Frankfurter** | `/latest?from=USD` | ECB Market index. Connected directly to the Cart checkout parser. |

## 💻 Tech Stack
- **Next.js 15** — App Router, Server Components, ISR API Routes
- **React 19** — Contexts, Refs, Complex Application State Management
- **TypeScript** — Strict type-safety architectures across component trees
- **Vanilla CSS** — Custom responsive design system, global layout spacing, hover heuristics

---

## 🛠️ Usage Instructions

Install packages:
```bash
npm install
```

Boot Development Server:
```bash
npm run dev
```
Navigate to: **http://localhost:3000** 

### Building for Production
```bash
npm run build   # Initiates Next.js compiler optimizations and tree-shakes unused components
npm start       # Fires up node production server
```
