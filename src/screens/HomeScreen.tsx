import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottleCard } from '../components/BottleCard';
import { api, getDataSourceMode } from '../services/api';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [dataSourceMode, setDataSourceMode] = useState<'supabase' | 'mock'>('supabase');

  useEffect(() => {
    async function load() {
      setState('loading');
      setErrorMessage('');

      try {
        const [bottleData, storeData] = await Promise.all([api.getBottles(), api.getStores()]);
        setBottles(bottleData);
        setStores(storeData);
        setSelectedBottle(bottleData[0] ?? null);
        setDataSourceMode(getDataSourceMode());
        setState('success');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setState('error');
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!selectedBottle) {
      return;
    }

    const activeBottle = selectedBottle;

    async function loadListings() {
      try {
        setListings(await api.getListingsByBottle(activeBottle.id));
      } catch {
        setListings([]);
      }
    }

    loadListings();
  }, [selectedBottle]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return bottles;
    }

    return bottles.filter((bottle) => `${bottle.name} ${bottle.distillery}`.toLowerCase().includes(q));
  }, [bottles, search]);

  if (state === 'loading' || state === 'idle') {
    return <ActivityIndicator size="large" color="#fbbf24" style={styles.loader} />;
  }

  if (state === 'error') {
    return <Text style={styles.error}>Unable to load data from Supabase. {errorMessage}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Bourbon Finder</Text>
      <Text style={styles.subtitle}>Search {bottles.length} bottles and compare prices across {stores.length} stores.</Text>
      {dataSourceMode === 'mock' ? <Text style={styles.notice}>Using local sample data because the configured Supabase project is unavailable.</Text> : null}

      <BottleSearch value={search} onChange={setSearch} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending bottles</Text>
        {filtered.map((bottle) => (
          <BottleCard key={bottle.id} bottle={bottle} onPress={(id) => setSelectedBottle(bottles.find((item) => item.id === id) ?? null)} />
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
    lineHeight: 20,
  },
  section: {
    marginTop: 6,
  },
  notice: {
    color: '#fbbf24',
    marginBottom: 12,
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
