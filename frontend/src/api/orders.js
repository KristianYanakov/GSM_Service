import apiClient from "./client";

export const createOrder = (orderData) =>
  apiClient.post("/orders/", orderData);

export const getOrderByNumber = (orderNumber) =>
  apiClient.get(`/orders/${orderNumber}/`);