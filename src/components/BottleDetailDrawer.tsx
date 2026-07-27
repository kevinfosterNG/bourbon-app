import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BottleDetail } from '../screens/BottleDetail';
import { StoreMap } from '../screens/StoreMap';
import type { Bottle, Listing } from '../types';

type Props = {
  bottle: Bottle | null;
  listings: Listing[];
  onClose: () => void;
};

export function BottleDetailDrawer({ bottle, listings, onClose }: Props) {
  const drawerProgress = useRef(new Animated.Value(1)).current;
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    if (!bottle) {
      return;
    }

    drawerProgress.setValue(1);
    Animated.timing(drawerProgress, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [bottle, drawerProgress]);

  const translateX = drawerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(windowWidth, 440)],
  });

  return (
    <Modal
      transparent
      animationType="none"
      visible={bottle !== null}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close bottle details"
          style={styles.backdrop}
          onPress={onClose}
        />

        <Animated.View accessibilityViewIsModal style={[styles.drawer, { transform: [{ translateX }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Bottle details</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close drawer"
              hitSlop={12}
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeIcon}>X</Text>
            </Pressable>
          </View>

          {bottle ? (
            <ScrollView contentContainerStyle={styles.content}>
              <BottleDetail bottle={bottle} listings={listings} />
              {listings[0]?.store ? <StoreMap store={listings[0].store} /> : null}
            </ScrollView>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(3, 7, 18, 0.65)',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: '90%',
    maxWidth: 440,
    height: '100%',
    backgroundColor: '#111827',
    borderLeftWidth: 1,
    borderLeftColor: '#374151',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowOffset: { width: -8, height: 0 },
    shadowRadius: 18,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  closeIcon: {
    color: '#f9fafb',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
