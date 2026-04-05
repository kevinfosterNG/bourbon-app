import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PriceList } from '../components/PriceList';
import type { Bottle, Listing } from '../types';

type Props = {
  bottle: Bottle;
  listings: Listing[];
};

export function BottleDetail({ bottle, listings }: Props) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{bottle.name}</Text>
      <Text style={styles.meta}>{bottle.distillery}</Text>
      <Text style={styles.tagLine}>{bottle.flavorTags.join(' • ')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price comparison</Text>
        <PriceList listings={listings} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    color: '#f9fafb',
    fontSize: 24,
    fontWeight: '800',
  },
  meta: {
    color: '#d1d5db',
    marginTop: 8,
  },
  tagLine: {
    color: '#fbbf24',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});
