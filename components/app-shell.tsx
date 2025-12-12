import Sidebar, { SIDEBAR_WIDTH } from '@/components/sidebar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BRAND_PRIMARY } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AppShellProps {
  title: string;
  children?: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const iconColor = useThemeColor({}, 'text');

  const scrimOpacity = translateX.interpolate({
    inputRange: [0, SIDEBAR_WIDTH],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: sidebarOpen ? SIDEBAR_WIDTH : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen, translateX]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleNavigate = (path: Parameters<typeof router.push>[0]) => {
    // Close the sidebar with the slide animation, then navigate.
    setSidebarOpen(false);
    setTimeout(() => {
      router.push(path);
    }, 220);
  };

  return (
    <ThemedView style={styles.container}>
      <Sidebar translateX={translateX} onNavigate={handleNavigate} />

      <Animated.View style={[styles.mainContent, { transform: [{ translateX }] }]}> 
        <Animated.View
          pointerEvents={sidebarOpen ? 'auto' : 'none'}
          style={[styles.darkenOverlay, { opacity: scrimOpacity }]}
        >
          <TouchableOpacity
            style={styles.scrimTouch}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        </Animated.View>

        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.hamburgerButton} onPress={toggleSidebar}>
            <FontAwesome6 name="bars" size={30} color={iconColor} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.headerTitle, { color: BRAND_PRIMARY }]}>
            {title}
          </ThemedText>
        </ThemedView>
        <View style={styles.divider} />

        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 28,
  },
  darkenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 5,
  },
  divider: {
    alignSelf: 'center',
    width: '90%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 16,
    marginBottom: 8,
  },
  scrimTouch: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 8,
  },
  hamburgerButton: {
    padding: 4,
  },
});
