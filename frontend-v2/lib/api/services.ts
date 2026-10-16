import { apiRequest, unwrapResults } from "./client";

export interface ApiServiceCategory {
  id: number;
  name: string;
  slug?: string;
}

export interface ApiServiceItem {
  id: number;
  name: string;
  description: string;
  price_from: string | number;
  turnaround_time?: string;
  is_featured?: boolean; // Future backend field
  category?: ApiServiceCategory | null;
}

export const getServiceCategories = async (): Promise<ApiServiceCategory[]> => {
  const data = await apiRequest<ApiServiceCategory[] | { results: ApiServiceCategory[] }>(
    "/services/categories/"
  );
  return unwrapResults(data);
};

export const getServices = async (): Promise<ApiServiceItem[]> => {
  const data = await apiRequest<ApiServiceItem[] | { results: ApiServiceItem[] }>("/services/");
  return unwrapResults(data);
};