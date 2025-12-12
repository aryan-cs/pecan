import { ThemedText } from '@/components/themed-text';
import { BRAND_PRIMARY } from '@/constants/theme';
import { FontAwesome6, Octicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

export const SIDEBAR_WIDTH = 280;

type Props = {
  translateX: Animated.Value;
  onNavigate?: (path: Parameters<typeof router.push>[0]) => void;
};

export default function Sidebar({ translateX, onNavigate }: Props) {
  const pathname = usePathname();

  const slideX = translateX.interpolate({
    inputRange: [0, SIDEBAR_WIDTH],
    outputRange: [-SIDEBAR_WIDTH, 0],
    extrapolate: 'clamp',
  });

  const handlePress = (path: Parameters<typeof router.push>[0]) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  const isActive = (target: string) => {
    if (!pathname) return false;
    // Expo Router typically returns paths without group segments like (tabs).
    const simpleTarget = target.replace('/(tabs)', '');
    const simplePath = pathname.replace('/(tabs)', '');
    return simplePath === simpleTarget;
  };

  return (
    <Animated.View style={[styles.panel, { transform: [{ translateX: slideX }] }] }>
      <ThemedText type="title">Menu</ThemedText>
      <ThemedText type="default">All systems go.</ThemedText>

      <View style={styles.menuSection}>
        <Pressable style={styles.menuItem} onPress={() => handlePress('/(tabs)')}>
          <View style={styles.menuItemContent}>
            <Octicons
              name="home-fill"
              size={22}
              color={isActive('/') ? BRAND_PRIMARY : '#ffffff'}
            />
            <ThemedText
              style={[
                styles.menuItemText,
                isActive('/') ? { color: BRAND_PRIMARY } : undefined,
              ]}
            >
              Home
            </ThemedText>
          </View>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => handlePress('/(tabs)/button2')}>
          <View style={styles.menuItemContent}>
            <FontAwesome6
              name="user-group"
              solid
              size={22}
              color={isActive('/button2') ? BRAND_PRIMARY : '#ffffff'}
            />
            <ThemedText
              style={[
                styles.menuItemText,
                isActive('/button2') ? { color: BRAND_PRIMARY } : undefined,
              ]}
            >
              Groups
            </ThemedText>
          </View>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => handlePress('/(tabs)/button3')}>
          <View style={styles.menuItemContent}>
            <FontAwesome6
              name="wallet"
              solid
              size={22}
              color={isActive('/button3') ? BRAND_PRIMARY : '#ffffff'}
            />
            <ThemedText
              style={[
                styles.menuItemText,
                isActive('/button3') ? { color: BRAND_PRIMARY } : undefined,
              ]}
            >
              Wallet
            </ThemedText>
          </View>
        </Pressable>
      </View>

      <View style={styles.footerSection}>
        <Pressable style={styles.menuItem} onPress={() => handlePress('/(tabs)/settings')}>
          <View style={styles.menuItemContent}>
            <FontAwesome6
              name="gear"
              solid
              size={22}
              color={isActive('/settings') ? BRAND_PRIMARY : '#ffffff'}
            />
            <ThemedText
              style={[
                styles.menuItemText,
                isActive('/settings') ? { color: BRAND_PRIMARY } : undefined,
              ]}
            >
              Settings
            </ThemedText>
          </View>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => handlePress('/(tabs)/profile')}>
          <View style={styles.menuItemContent}>
            <FontAwesome6
              name="circle-user"
              solid
              size={22}
              color={isActive('/profile') ? BRAND_PRIMARY : '#ffffff'}
            />
            <ThemedText
              style={[
                styles.menuItemText,
                isActive('/profile') ? { color: BRAND_PRIMARY } : undefined,
              ]}
            >
              Profile
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: 48,
    paddingHorizontal: 20,
    gap: 16,
    zIndex: 10,
  },
  menuSection: {
    marginTop: 24,
    gap: 12,
  },
  footerSection: {
    marginTop: 'auto',
    gap: 12,
    paddingBottom: 24,
  },
  menuItem: {
    marginHorizontal: 6,
    marginVertical: 12,
    // backgroundColor: 'red',
    // borderTopColor: 'rgba(255,255,255,0.2)',
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: 'rgba(255,255,255,0.2)',
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemText: {
    fontSize: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
