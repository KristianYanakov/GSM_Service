import { apiRequest, unwrapResults } from "./client";

export interface ApiLocation {
  id: number;
  name: string;
  address: string;
  phone?: string;
  workdays_text?: string;
  working_hours_weekdays?: string;
  working_hours_weekends?: string;
  latitude: string | number;
  longitude: string | number;
}

export interface ApiGalleryImage {
  id: number;
  image: string;
  caption?: string;
}

export interface ApiShopInfo {
  about_text?: string;
  staff_blurb?: string;
  facebook_url?: string;
  instagram_url?: string;
  email?: string;
}

export const getLocations = async (): Promise<ApiLocation[]> => {
  const data = await apiRequest<ApiLocation[] | { results: ApiLocation[] }>("/shop-info/locations/");
  return unwrapResults(data);
};

export const getGallery = async (): Promise<ApiGalleryImage[]> => {
  const data = await apiRequest<ApiGalleryImage[] | { results: ApiGalleryImage[] }>("/shop-info/gallery/");
  return unwrapResults(data);
};

export const getShopInfo = (): Promise<ApiShopInfo> =>
  apiRequest<ApiShopInfo>("/shop-info/info/");