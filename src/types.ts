export type Bottle = {
  id: string;
  name: string;
  distillery: string;
  proof: number;
  category: string;
  imageUrl?: string;
  flavorTags: string[];
};

export type Store = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    state: string;
  };
  verified: boolean;
};

export type Listing = {
  id: string;
  bottleId: string;
  storeId: string;
  price: number;
  inStock: boolean;
  lastUpdated: string;
  notes?: string;
  store?: Store;
};

export type CreateListingInput = {
  bottleId: string;
  storeId: string;
  price: number;
  inStock: boolean;
  notes?: string;
};
