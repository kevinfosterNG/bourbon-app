import { StyleSheet, Text, View } from 'react-native';
import type { Listing } from '../types';

type Props = {
  listings: Listing[];
};

export function PriceList({ listings }: Props) {
  const sorted = [...listings].sort((a, b) => a.price - b.price);

  return (
    <View style={styles.container}>
      {sorted.map((listing, index) => (
        <View key={listing.id} style={[styles.row, index === 0 && styles.bestPrice]}>
          <View>
            <Text style={styles.storeName}>{listing.store?.name ?? 'Unknown store'}</Text>
            <Text style={styles.details}>
              {listing.store?.location.city}, {listing.store?.location.state} • {listing.inStock ? 'In stock' : 'Out of stock'}
            </Text>
          </View>
          <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestPrice: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  storeName: {
    color: '#f9fafb',
    fontWeight: '700',
  },
  details: {
    color: '#9ca3af',
    marginTop: 4,
    fontSize: 12,
  },
  price: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: '800',
  },
});
