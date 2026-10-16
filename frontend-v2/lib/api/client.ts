const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    let message = "Something went wrong submitting your request. Please try again.";
    if (res.status === 429) {
      message = "Too many attempts. Please wait a bit before trying again.";
    } else if (data && typeof data === "object") {
      message = Object.entries(data)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
        .join(" | ");
    }
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export function unwrapResults<T>(data: T[] | { results: T[] }): T[] {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export function resolveMediaUrl(url?: string | null, fallback = "/images/p-phone-1.png"): string {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/media/")) return `${BACKEND_ORIGIN}${url}`;
  return url;
}