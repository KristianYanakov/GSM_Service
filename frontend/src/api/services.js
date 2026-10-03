import apiClient from "./client";

export const getServiceCategories = () =>
  apiClient.get("/services/categories/");

export const getServices = () => apiClient.get("/services/");