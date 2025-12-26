import {
  ThemeControllerProvider,
  useThemeController,
} from "@/context/theme-context";
import { supabase } from "@/lib/supabase";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import * as Font from "expo-font";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { default as React, useEffect, useState } from "react";
import { Appearance } from "react-native";
import "react-native-reanimated";

import AuthScreen from "./auth";

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { colorScheme } = useThemeController();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Font.loadAsync({
          "Inter-Regular": require("@/assets/fonts/Inter/static/Inter_18pt-Regular.ttf"),
          "Inter-Bold": require("@/assets/fonts/Inter/static/Inter_18pt-Bold.ttf"),
          "Inter-SemiBold": require("@/assets/fonts/Inter/static/Inter_18pt-SemiBold.ttf"),
          "BBH_Bartle-Regular": require("@/assets/fonts/BBH_Bartle/BBHBartle-Regular.ttf"),
        });

        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleDeepLink = (event: { url: string }) => {
      supabase.auth.getSession();
    };
    const linkingSubscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  if (!isReady) {
    return null;
  }

  if (!session) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthScreen />
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="item/[id]" options={{ title: "Item Details" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const systemScheme = Appearance.getColorScheme() ?? "light";

  return (
    <ThemeControllerProvider initialScheme={systemScheme}>
      <RootNavigation />
    </ThemeControllerProvider>
  );
}
