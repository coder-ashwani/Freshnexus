// ── Open Food Facts Types ──────────────────────────────────────────────────────

export interface Nutriments {
  energy_kcal?: number;
  energy_kcal_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
}

export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  categories_tags?: string[];
  categories_tags_en?: string[]; // aliased field
  image_url?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  ingredients_text?: string;
  allergens?: string;
  allergens_tags?: string[];
  quantity?: string;
  countries?: string;
  labels?: string;
  labels_tags?: string[];
  manufacturing_places?: string;
  origins?: string;
  nutriments?: Nutriments;
  selected_images?: {
    front?: {
      display?: { en?: string };
      small?: { en?: string };
    };
  };
}

export interface SearchResponse {
  count: number;
  page: number;
  page_size: number;
  page_count: number;
  products: Product[];
}

export interface ProductResponse {
  status: number;
  product: Product;
}

// ── Frankfurter / Currency Types ──────────────────────────────────────────────

export interface CurrencyRates {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}
