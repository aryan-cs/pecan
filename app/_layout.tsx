
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { default as React, useEffect, useState } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'Inter-Regular': require('@/assets/fonts/Inter/static/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('@/assets/fonts/Inter/static/Inter_18pt-Bold.ttf'),
        'Inter-SemiBold': require('@/assets/fonts/Inter/static/Inter_18pt-SemiBold.ttf'),
        'BBH_Bartle-Regular': require('@/assets/fonts/BBH_Bartle/BBHBartle-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      children={
        <>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </>
      }
    />
  );
}
