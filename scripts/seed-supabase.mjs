import { readFileSync } from 'node:fs';
import { Client } from 'pg';
import { loadSupabaseDbEnv } from './lib/supabase-env.mjs';

const bottles = JSON.parse(readFileSync(new URL('./seed-bottles.json', import.meta.url), 'utf8'));

const stores = [
  {
    id: 's001',
    name: 'Cheers Liquor',
    lat: 36.1627,
    lng: -86.7816,
    city: 'Nashville',
    state: 'TN',
    verified: false,
  },
  {
    id: 's002',
    name: 'Bluegrass Spirits',
    lat: 38.2527,
    lng: -85.7585,
    city: 'Louisville',
    state: 'KY',
    verified: true,
  },
  {
    id: 's003',
    name: 'Barrel House Wine and Spirits',
    lat: 35.9606,
    lng: -83.9207,
    city: 'Knoxville',
    state: 'TN',
    verified: true,
  },
];

const listings = [
  { id: 'l001', bottleId: 'b001', storeId: 's001', price: 129.99, inStock: true, notes: 'Store pick' },
  { id: 'l002', bottleId: 'b001', storeId: 's002', price: 119.99, inStock: true, notes: null },
  { id: 'l003', bottleId: 'b002', storeId: 's001', price: 59.99, inStock: true, notes: null },
  { id: 'l004', bottleId: 'b002', storeId: 's002', price: 62.99, inStock: false, notes: null },
  { id: 'l005', bottleId: 'b003', storeId: 's003', price: 74.99, inStock: true, notes: 'Limited shelf stock' },
  { id: 'l006', bottleId: 'b004', storeId: 's003', price: 94.99, inStock: true, notes: null },
];

const client = new Client(loadSupabaseDbEnv());

async function upsertBottles() {
  const query = `
    insert into public.bottles (id, name, distillery, proof, category, image_url, flavor_tags)
    values ($1, $2, $3, $4, $5, $6, $7)
    on conflict (id) do update set
      name = excluded.name,
      distillery = excluded.distillery,
      proof = excluded.proof,
      category = excluded.category,
      image_url = excluded.image_url,
      flavor_tags = excluded.flavor_tags
  `;

  for (const bottle of bottles) {
    await client.query(query, [
      bottle.id,
      bottle.name,
      bottle.distillery,
      bottle.proof,
      bottle.category,
      bottle.imageUrl ?? null,
      bottle.flavorTags ?? [],
    ]);
  }
}

async function upsertStores() {
  const query = `
    insert into public.stores (id, name, lat, lng, city, state, verified)
    values ($1, $2, $3, $4, $5, $6, $7)
    on conflict (id) do update set
      name = excluded.name,
      lat = excluded.lat,
      lng = excluded.lng,
      city = excluded.city,
      state = excluded.state,
      verified = excluded.verified
  `;

  for (const store of stores) {
    await client.query(query, [
      store.id,
      store.name,
      store.lat,
      store.lng,
      store.city,
      store.state,
      store.verified,
    ]);
  }
}

async function upsertListings() {
  const query = `
    insert into public.listings (id, bottle_id, store_id, price, in_stock, notes, last_updated)
    values ($1, $2, $3, $4, $5, $6, now())
    on conflict (id) do update set
      bottle_id = excluded.bottle_id,
      store_id = excluded.store_id,
      price = excluded.price,
      in_stock = excluded.in_stock,
      notes = excluded.notes,
      last_updated = excluded.last_updated
  `;

  for (const listing of listings) {
    await client.query(query, [
      listing.id,
      listing.bottleId,
      listing.storeId,
      listing.price,
      listing.inStock,
      listing.notes,
    ]);
  }
}

try {
  await client.connect();
  await client.query('begin');
  await upsertBottles();
  await upsertStores();
  await upsertListings();
  await client.query('commit');
  console.log(`Seeded ${bottles.length} bottles, ${stores.length} stores, and ${listings.length} listings.`);
} catch (error) {
  await client.query('rollback').catch(() => {});
  throw error;
} finally {
  await client.end().catch(() => {});
}
