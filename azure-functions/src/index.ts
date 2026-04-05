import { bottleData, listings, stores } from './mockData';

type CreateListingInput = {
  bottleId: string;
  storeId: string;
  price: number;
  inStock: boolean;
  notes?: string;
};

export function getBottles() {
  return bottleData;
}

export function getBottle(id: string) {
  return bottleData.find((bottle) => bottle.id === id) ?? null;
}

export function getStores() {
  return stores;
}

export function getListings(bottleId?: string) {
  if (!bottleId) return listings;
  return listings.filter((listing) => listing.bottleId === bottleId);
}

export function createListing(input: CreateListingInput) {
  const listing = {
    id: `l${Date.now()}`,
    bottleId: input.bottleId,
    storeId: input.storeId,
    price: input.price,
    inStock: input.inStock,
    notes: input.notes,
    lastUpdated: new Date().toISOString(),
  };

  listings.push(listing);
  return listing;
}
