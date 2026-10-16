import { apiRequest, unwrapResults } from "./client";

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  blurb?: string | null;
}

export interface ApiProductImage {
  id?: number;
  image: string;
  alt_text?: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  short_description?: string; // Future backend field
  description?: string;
  stock_quantity?: number;
  is_featured?: boolean;      // Future backend field
  featured?: boolean;         // Future backend field
  product_type?: "phone" | "accessory";
  category?: ApiCategory | null;
  primary_image?: ApiProductImage | null;
  images?: ApiProductImage[];
  details?: { label: string; value: string }[]; // Future backend field
  created_at?: string;
}

export interface PaginatedProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
}

export const getCategories = async (): Promise<ApiCategory[]> => {
  const data = await apiRequest<ApiCategory[] | { results: ApiCategory[] }>("/catalog/categories/");
  return unwrapResults(data);
};

export const getProducts = async (
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<PaginatedProducts> => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== "" && val !== "all") {
      searchParams.set(key, String(val));
    }
  });
  const query = searchParams.toString();
  const endpoint = `/catalog/products/${query ? `?${query}` : ""}`;
  const data = await apiRequest<PaginatedProducts | ApiProduct[]>(endpoint);

  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
};

export const getProductBySlug = (slug: string): Promise<ApiProduct> =>
  apiRequest<ApiProduct>(`/catalog/products/${slug}/`);