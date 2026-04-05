import bottles from '../../scripts/seed-bottles.json';

export const stores = [
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
];

export const listings = [
  { id: 'l001', bottleId: 'b001', storeId: 's001', price: 129.99, inStock: true, lastUpdated: new Date().toISOString(), notes: 'Store pick' },
  { id: 'l002', bottleId: 'b001', storeId: 's002', price: 119.99, inStock: true, lastUpdated: new Date().toISOString() },
  { id: 'l003', bottleId: 'b002', storeId: 's001', price: 59.99, inStock: true, lastUpdated: new Date().toISOString() },
  { id: 'l004', bottleId: 'b002', storeId: 's002', price: 62.99, inStock: false, lastUpdated: new Date().toISOString() },
];

export const bottleData = bottles;
