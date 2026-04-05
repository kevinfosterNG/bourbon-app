import type { Bottle, Listing, Store } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:7071/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getBottles: () => request<Bottle[]>('/bottles'),
  getBottle: (id: string) => request<Bottle>(`/bottles/${id}`),
  getStores: () => request<Store[]>('/stores'),
  getListingsByBottle: (bottleId: string) => request<Listing[]>(`/listings?bottleId=${encodeURIComponent(bottleId)}`),
};
