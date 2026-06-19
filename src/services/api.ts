import type { Bottle, Listing, Store } from '../types';
import { getSupabaseConfigError } from '../config/env';
import { mockData } from '../data/mockData';
import { supabase } from './supabase';

type BottleRow = {
  id: string;
  name: string;
  distillery: string;
  proof: number;
  category: string;
  image_url: string | null;
  flavor_tags: string[] | null;
};

type StoreRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  verified: boolean;
};

type ListingRow = {
  id: string;
  bottle_id: string;
  store_id: string;
  price: number | string;
  in_stock: boolean;
  last_updated: string;
  notes: string | null;
  store?: StoreRow | StoreRow[] | null;
};

function getClient() {
  if (!supabase) {
    throw new Error(getSupabaseConfigError());
  }

  return supabase;
}

let dataSourceMode: 'supabase' | 'mock' = supabase ? 'supabase' : 'mock';

export function getDataSourceMode() {
  return dataSourceMode;
}

async function runWithFallback<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>) {
  try {
    const result = await operation();
    dataSourceMode = 'supabase';
    return result;
  } catch (error) {
    dataSourceMode = 'mock';
    console.warn('Falling back to local sample data because Supabase is unavailable.', error);
    return fallback();
  }
}

function mapBottle(row: BottleRow): Bottle {
  return {
    id: row.id,
    name: row.name,
    distillery: row.distillery,
    proof: Number(row.proof),
    category: row.category,
    imageUrl: row.image_url ?? undefined,
    flavorTags: row.flavor_tags ?? [],
  };
}

function mapStore(row: StoreRow): Store {
  return {
    id: row.id,
    name: row.name,
    location: {
      lat: row.lat,
      lng: row.lng,
      city: row.city,
      state: row.state,
    },
    verified: row.verified,
  };
}

function mapListing(row: ListingRow): Listing {
  const store = Array.isArray(row.store) ? row.store[0] : row.store;

  return {
    id: row.id,
    bottleId: row.bottle_id,
    storeId: row.store_id,
    price: Number(row.price),
    inStock: row.in_stock,
    lastUpdated: row.last_updated,
    notes: row.notes ?? undefined,
    store: store ? mapStore(store) : undefined,
  };
}

export const api = {
  async getBottles() {
    return runWithFallback(async () => {
      const { data, error } = await getClient()
        .from('bottles')
        .select('id, name, distillery, proof, category, image_url, flavor_tags')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      const bottles = (data ?? []).map(mapBottle);
      return bottles.length > 0 ? bottles : mockData.bottles;
    }, () => mockData.bottles);
  },

  async getBottle(id: string) {
    return runWithFallback(async () => {
      const { data, error } = await getClient()
        .from('bottles')
        .select('id, name, distillery, proof, category, image_url, flavor_tags')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return mapBottle(data);
    }, () => {
      const bottle = mockData.bottles.find((item) => item.id === id);
      if (!bottle) {
        throw new Error(`Bottle ${id} was not found in sample data.`);
      }

      return bottle;
    });
  },

  async getStores() {
    return runWithFallback(async () => {
      const { data, error } = await getClient()
        .from('stores')
        .select('id, name, lat, lng, city, state, verified')
        .order('state', { ascending: true })
        .order('city', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      const stores = (data ?? []).map(mapStore);
      return stores.length > 0 ? stores : mockData.stores;
    }, () => mockData.stores);
  },

  async getListingsByBottle(bottleId: string) {
    return runWithFallback(async () => {
      const { data, error } = await getClient()
        .from('listings')
        .select('id, bottle_id, store_id, price, in_stock, last_updated, notes, store:stores(id, name, lat, lng, city, state, verified)')
        .eq('bottle_id', bottleId)
        .order('price', { ascending: true });

      if (error) {
        throw error;
      }

      const listings = (data ?? []).map((row) => mapListing(row as ListingRow));
      return listings.length > 0 ? listings : mockData.listings.filter((item) => item.bottleId === bottleId);
    }, () => mockData.listings.filter((item) => item.bottleId === bottleId));
  },
};
