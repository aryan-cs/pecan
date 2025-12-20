import { AppShell } from '@/components/app-shell';
import { Slot, usePathname } from 'expo-router';
import React from 'react';

function getTitle(pathname: string) {
  // Expo Router strips group segments like (tabs) from the URL,
  // so we match on the visible path (e.g. '/wallet').
  if (pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/')
    return 'Kale';
  if (pathname === '/button1' || pathname === '/(tabs)/button1') return 'Button 1';
  if (pathname === '/wallet' || pathname === '/(tabs)/wallet') return 'Wallet';
  if (pathname === '/settings' || pathname === '/(tabs)/settings') return 'Settings';
  if (pathname === '/profile' || pathname === '/(tabs)/profile') return 'Profile';
  return 'Kale';
}

// Layout wraps all tab routes in AppShell so the sidebar and
// slide animation are shared across pages.
export default function TabLayout() {
  const pathname = usePathname();
  const title = getTitle(pathname ?? '/(tabs)');

  return (
    <AppShell title={title}>
      <Slot />
    </AppShell>
  );
}
