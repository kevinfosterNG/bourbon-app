import { bottleData, listings, stores } from './mockData';

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
