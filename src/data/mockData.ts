import type { Bottle, Listing, Store } from '../types';

const bottleData = require('../../scripts/seed-bottles.json') as Bottle[];

export const stores: Store[] = [
  {
    id: 's001',
    name: 'Cheers Liquor',
    location: { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' },
    verified: false,
  },
  {
    id: 's002',
    name: 'Bluegrass Spirits',
    location: { lat: 38.2527, lng: -85.7585, city: 'Louisville', state: 'KY' },
    verified: true,
  },
  {
    id: 's003',
    name: 'Barrel House Wine and Spirits',
    location: { lat: 35.9606, lng: -83.9207, city: 'Knoxville', state: 'TN' },
    verified: true,
  },
];

export const listings: Listing[] = [
  { id: 'l001', bottleId: 'b001', storeId: 's001', price: 129.99, inStock: true, lastUpdated: new Date().toISOString(), notes: 'Store pick', store: stores[0] },
  { id: 'l002', bottleId: 'b001', storeId: 's002', price: 119.99, inStock: true, lastUpdated: new Date().toISOString(), store: stores[1] },
  { id: 'l003', bottleId: 'b002', storeId: 's001', price: 59.99, inStock: true, lastUpdated: new Date().toISOString(), store: stores[0] },
  { id: 'l004', bottleId: 'b002', storeId: 's002', price: 62.99, inStock: false, lastUpdated: new Date().toISOString(), store: stores[1] },
  { id: 'l005', bottleId: 'b003', storeId: 's003', price: 74.99, inStock: true, lastUpdated: new Date().toISOString(), notes: 'Limited shelf stock', store: stores[2] },
  { id: 'l006', bottleId: 'b004', storeId: 's003', price: 94.99, inStock: true, lastUpdated: new Date().toISOString(), store: stores[2] },
];

export const mockData = {
  bottles: bottleData,
  stores,
  listings,
};
