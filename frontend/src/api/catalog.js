import apiClient from "./client";

export const getCategories = () => apiClient.get("/catalog/categories/");

export const getProducts = (params = {}) =>
  apiClient.get("/catalog/products/", { params });

export const getProductBySlug = (slug) =>
  apiClient.get(`/catalog/products/${slug}/`);