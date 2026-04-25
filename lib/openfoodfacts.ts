import type { SearchResponse, Product, ProductResponse } from "@/types";

const BASE = "https://world.openfoodfacts.org";

const HEADERS = {
  "User-Agent": "FreshNexus/1.0 (contact@freshnexus.dev)",
  Accept: "application/json",
};

const LIST_FIELDS = [
  "code",
  "product_name",
  "brands",
  "image_front_small_url",
  "image_url",
  "nutriscore_grade",
  "ecoscore_grade",
  "categories_tags",
  "nova_group",
  "quantity",
].join(",");

const DETAIL_FIELDS = [
  "code",
  "product_name",
  "brands",
  "categories",
  "categories_tags",
  "image_front_url",
  "image_url",
  "nutriscore_grade",
  "ecoscore_grade",
  "nova_group",
  "ingredients_text",
  "allergens",
  "allergens_tags",
  "quantity",
  "countries",
  "labels",
  "labels_tags",
  "manufacturing_places",
  "origins",
  "nutriments",
  "selected_images",
].join(",");

async function fetchWithRetry(
  url: string,
  options: RequestInit & { next?: { revalidate?: number } },
  attempts = 3
): Promise<Response> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { ...options, next: (options as { next?: { revalidate?: number } }).next });

      if ((res.status >= 500 || res.status === 429) && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 600 * (i + 1)));
        continue;
      }
      return res;
    } catch {
      if (i === attempts - 1) throw new Error("Network error — could not reach Open Food Facts");
      await new Promise((r) => setTimeout(r, 600 * (i + 1)));
    }
  }
  throw new Error("Failed after retries");
}

import MOCK_DATA from "./mock-grocery-data.json";

// Fetches a list of grocery products
// Prioritizes the OpenFoodFacts API, but safely falls back to our local mock JSON if the request fails or times out.
export async function searchProducts({
  query = "",
  category = "",
  page = 1,
  pageSize = 24,
}: {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<SearchResponse> {
  let url: string;

  if (query) {
    const params = new URLSearchParams({
      search_terms: query,
      fields: LIST_FIELDS,
      page: String(page),
      page_size: String(pageSize),
      sort_by: "popularity_key",
      json: "1",
      action: "process",
    });
    if (category) {
      params.set("tagtype_0", "categories");
      params.set("tag_contains_0", "contains");
      params.set("tag_0", category);
    }
    url = `${BASE}/cgi/search.pl?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      fields: LIST_FIELDS,
      page: String(page),
      page_size: String(pageSize),
      sort_by: "popularity_key",
      json: "1",
    });
    if (category) params.set("categories_tags_en", category);
    url = `${BASE}/api/v2/search?${params.toString()}`;
  }

  try {
    const res = await fetchWithRetry(
      url,
      { headers: HEADERS, next: { revalidate: 300 } } as RequestInit & { next?: { revalidate?: number } }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const count = data.count ?? data.products?.length ?? 0;

    if (count > 0 && data.products) {
      return {
        count,
        page: data.page ?? page,
        page_size: data.page_size ?? pageSize,
        page_count: data.page_count ?? Math.ceil(count / pageSize),
        products: data.products,
      };
    }
    throw new Error("No products found from API");
  } catch (err) {
    console.error(`Open Food Facts API failed or returned empty (${err}), providing fallback data`);

    let filtered = MOCK_DATA as Product[];
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => p.product_name?.toLowerCase().includes(q) || p.brands?.toLowerCase().includes(q));
    }
    if (category) {
      filtered = filtered.filter(p => p.categories_tags?.includes(`en:${category}`));
    }

    return {
      count: filtered.length,
      page: 1,
      page_size: pageSize,
      page_count: 1,
      products: filtered,
    };
  }
}

// Get a single product details by its unique barcode ID
export async function getProduct(code: string): Promise<Product> {
  const params = new URLSearchParams({ fields: DETAIL_FIELDS });
  const url = `${BASE}/api/v2/product/${code}?${params.toString()}`;

  try {
    const res = await fetchWithRetry(
      url,
      { headers: HEADERS, next: { revalidate: 3600 } } as RequestInit & { next?: { revalidate?: number } }
    );

    if (!res.ok) throw new Error(`Open Food Facts product fetch failed: ${res.status}`);
    const data: ProductResponse = await res.json();
    if (data.status !== 1) throw new Error("Product not found from API");
    return data.product;
  } catch (err) {
    console.error(`Product detail fetch failed (${err}), falling back to mock data...`);

    const mockArr = MOCK_DATA as Product[];
    const mockProduct = mockArr.find(p => p.code === code);
    if (!mockProduct) {
      throw new Error(`Product not found and not available offline: ${code}`);
    }

    return {
      ...mockProduct,
      ingredients_text: "Mocked ingredients, vegetable oil, sugar, spices. (This product is being served from local offline backup due to Open Food Facts API outage).",
      nutriments: {
        energy_kcal_100g: 250,
        fat_100g: 12,
        saturated_fat_100g: 4,
        carbohydrates_100g: 30,
        sugars_100g: 15,
        proteins_100g: 5,
        salt_100g: 1.2
      }
    };
  }
}

export const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Beverages", value: "beverages" },
  { label: "Dairy", value: "dairies" },
  { label: "Snacks", value: "snacks" },
  { label: "Cereals", value: "cereals-and-their-products" },
  { label: "Fruits", value: "fruits-and-vegetables-based-foods" },
  { label: "Meats", value: "meat" },
  { label: "Breads", value: "breads" },
  { label: "Sauces", value: "sauces" },
  { label: "Chocolates", value: "chocolates" },
];
