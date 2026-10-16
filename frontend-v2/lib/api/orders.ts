import { apiRequest } from "./client";

export interface OrderCreatePayload {
  full_name: string;
  phone: string;
  email?: string;
  econt_office?: string;
  shipping_address?: string;
  notes?: string;
  website: string; // Honeypot field — stays empty for real users
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface OrderItemRead {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
}

export interface OrderRead {
  order_number: string;
  full_name: string;
  phone: string;
  email?: string;
  econt_office?: string;
  shipping_address?: string;
  notes?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "paid" | "cancelled";
  total_price: string;
  created_at?: string;
  items: OrderItemRead[];
}

export const createOrder = (orderData: OrderCreatePayload): Promise<OrderRead> =>
  apiRequest<OrderRead>("/orders/", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

export const getOrderByNumber = (orderNumber: string): Promise<OrderRead> =>
  apiRequest<OrderRead>(`/orders/${orderNumber}/`);