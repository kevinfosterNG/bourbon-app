import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottleCard } from '../components/BottleCard';
import { api } from '../services/api';
import type { Bottle, Listing, Store } from '../types';
import { BottleDetail } from './BottleDetail';
import { BottleSearch } from './BottleSearch';
import { StoreMap } from './StoreMap';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

export function HomeScreen() {
  const [search, setSearch] = useState('');
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [state, setState] = useState<LoadState>('idle');

  useEffect(() => {
    async function load() {
      setState('loading');
      try {
        const [bottleData, storeData] = await Promise.all([api.getBottles(), api.getStores()]);
        setBottles(bottleData);
        setStores(storeData);
        setSelectedBottle(bottleData[0] ?? null);
        setState('success');
      } catch {
        setState('error');
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!selectedBottle) return;

    async function loadListings() {
      try {
        const listingData = await api.getListingsByBottle(selectedBottle.id);
        const hydratedListings = listingData.map((listing) => ({
          ...listing,
          store: stores.find((store) => store.id === listing.storeId),
        }));
        setListings(hydratedListings);
      } catch {
        setListings([]);
      }
    }

    loadListings();
  }, [selectedBottle, stores]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bottles;
    return bottles.filter((bottle) => `${bottle.name} ${bottle.distillery}`.toLowerCase().includes(q));
  }, [bottles, search]);

  if (state === 'loading' || state === 'idle') {
    return <ActivityIndicator size="large" color="#fbbf24" style={styles.loader} />;
  }

  if (state === 'error') {
    return <Text style={styles.error}>Unable to load data from Azure Functions API.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>🥃 Bourbon Finder</Text>
      <Text style={styles.subtitle}>Search, compare prices, and check local inventory.</Text>

      <BottleSearch value={search} onChange={setSearch} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending bottles</Text>
        {filtered.map((bottle) => (
          <BottleCard key={bottle.id} bottle={bottle} onPress={(id) => setSelectedBottle(bottles.find((b) => b.id === id) ?? null)} />
        ))}
      </View>

      {selectedBottle ? <BottleDetail bottle={selectedBottle} listings={listings} /> : null}
      {listings[0]?.store ? <StoreMap store={listings[0].store} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    color: '#f9fafb',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: 4,
    marginBottom: 12,
  },
  section: {
    marginTop: 6,
  },
  sectionTitle: {
    color: '#f9fafb',
    fontWeight: '700',
    marginBottom: 8,
  },
  loader: {
    flex: 1,
  },
  error: {
    color: '#fca5a5',
    padding: 16,
  },
});
