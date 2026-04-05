import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Bottle } from '../types';

type Props = {
  bottle: Bottle;
  onPress: (id: string) => void;
};

export function BottleCard({ bottle, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(bottle.id)}>
      <Text style={styles.name}>{bottle.name}</Text>
      <Text style={styles.meta}>{bottle.distillery}</Text>
      <View style={styles.tagRow}>
        <Text style={styles.badge}>{bottle.category}</Text>
        <Text style={styles.badge}>{bottle.proof} proof</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  name: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: '#d1d5db',
    marginTop: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  badge: {
    color: '#fef3c7',
    backgroundColor: '#78350f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
  },
});
