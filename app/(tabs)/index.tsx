import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeController } from '@/context/theme-context';
import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const FAB_SIZE = 64;

export default function HomeScreen() {
  const { colorScheme } = useThemeController();
  const accent =
    colorScheme === 'dark'
      ? Colors.general.brandDarkMode
      : Colors.general.brandLightMode;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.tagline}>
        Making "I told you so" just a little bit sweeter.
      </ThemedText>

      <Pressable style={[styles.fab, { backgroundColor: accent }]} hitSlop={12}>
        <FontAwesome6 name="plus" size={22} color="#0e0e0e" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    textAlign: 'center',
    fontSize: 20,
  },
  fab: {
    position: 'absolute',
    bottom: FAB_SIZE / 4,
    right: FAB_SIZE / 4,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});