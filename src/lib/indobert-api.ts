// lib/indobert-api.ts

const API_BASE = process.env.INDOBERT_API_URL || "http://localhost:8080";

/**
 * Helper untuk panggil IndoBERT API dari Next.js backend (server-side only).
 * JANGAN panggil langsung dari client component — selalu lewat API route.
 */
export async function fetchIndoBERT<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }

  return res.json();
}
