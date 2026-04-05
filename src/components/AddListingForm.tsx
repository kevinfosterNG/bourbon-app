import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import type { CreateListingInput, Store } from '../types';

type Props = {
  bottleId: string;
  stores: Store[];
  onSubmit: (payload: CreateListingInput) => Promise<void>;
};

export function AddListingForm({ bottleId, stores, onSubmit }: Props) {
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [inStock, setInStock] = useState(true);
  const [storeId, setStoreId] = useState(stores[0]?.id ?? '');
  const [status, setStatus] = useState<string>('');

  const selectedStore = useMemo(() => stores.find((store) => store.id === storeId), [stores, storeId]);

  async function handleSubmit() {
    const numericPrice = Number(price);

    if (!storeId || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setStatus('Enter a valid price and store.');
      return;
    }

    try {
      setStatus('Saving...');
      await onSubmit({ bottleId, storeId, price: numericPrice, inStock, notes: notes.trim() || undefined });
      setPrice('');
      setNotes('');
      setInStock(true);
      setStatus('Listing added.');
    } catch {
      setStatus('Could not save listing.');
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Quick add listing (MVP)</Text>

      <Text style={styles.label}>Store ID</Text>
      <TextInput value={storeId} onChangeText={setStoreId} style={styles.input} placeholder="Store id" placeholderTextColor="#6b7280" />
      <Text style={styles.helper}>Selected: {selectedStore?.name ?? 'Unknown'}</Text>

      <Text style={styles.label}>Price</Text>
      <TextInput value={price} onChangeText={setPrice} style={styles.input} placeholder="89.99" keyboardType="decimal-pad" placeholderTextColor="#6b7280" />

      <Text style={styles.label}>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} style={styles.input} placeholder="Store pick" placeholderTextColor="#6b7280" />

      <View style={styles.stockRow}>
        <Text style={styles.label}>In stock</Text>
        <Switch value={inStock} onValueChange={setInStock} />
      </View>

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save listing</Text>
      </Pressable>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  title: {
    color: '#f9fafb',
    fontWeight: '700',
  },
  label: {
    color: '#d1d5db',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  helper: {
    color: '#9ca3af',
    fontSize: 12,
  },
  stockRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#b45309',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff7ed',
    fontWeight: '700',
  },
  status: {
    color: '#fbbf24',
    fontSize: 12,
  },
});
