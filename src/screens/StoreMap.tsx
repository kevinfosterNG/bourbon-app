import { StyleSheet, Text, View } from 'react-native';
import type { Store } from '../types';

type Props = {
  store: Store;
};

export function StoreMap({ store }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{store.name}</Text>
      <Text style={styles.meta}>
        {store.location.city}, {store.location.state}
      </Text>
      <Text style={styles.meta}>
        lat/lng: {store.location.lat}, {store.location.lng}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  name: {
    color: '#f9fafb',
    fontWeight: '700',
  },
  meta: {
    color: '#9ca3af',
    marginTop: 4,
  },
});
