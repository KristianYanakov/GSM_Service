import apiClient from "./client";

export const getLocations = () => apiClient.get("/shop-info/locations/");

export const getGallery = () => apiClient.get("/shop-info/gallery/");

export const getShopInfo = () => apiClient.get("/shop-info/info/");