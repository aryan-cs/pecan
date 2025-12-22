import Sidebar, { SIDEBAR_WIDTH } from "@/components/sidebar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { type ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppShellProps {
  title: string;
  children?: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const iconColor = useThemeColor({}, "text");
  const gestureStartX = useRef(0);
  const { colorScheme } = useThemeController();
  const accent =
    colorScheme === "dark"
      ? Colors.general.brandDarkMode
      : Colors.general.brandLightMode;

  const scrimOpacity = translateX.interpolate({
    inputRange: [0, SIDEBAR_WIDTH],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: sidebarOpen ? SIDEBAR_WIDTH : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen, translateX]);

  useEffect(() => {
    if (sidebarOpen) {
      Keyboard.dismiss();
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    if (!sidebarOpen) {
      Keyboard.dismiss();
    }
    setSidebarOpen((prev) => !prev);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => sidebarOpen,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy, x0 } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx < 10 || absDx <= absDy) return false;

        if (!sidebarOpen) {
          return x0 <= 30 && dx > 0;
        }

        return true;
      },
      onPanResponderGrant: () => {
        translateX.stopAnimation((currentValue: number) => {
          gestureStartX.current = currentValue;
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const next = Math.min(
          SIDEBAR_WIDTH,
          Math.max(0, gestureStartX.current + gestureState.dx)
        );
        translateX.setValue(next);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const releaseValue = Math.min(
          SIDEBAR_WIDTH,
          Math.max(0, gestureStartX.current + gestureState.dx)
        );
        const { vx } = gestureState;

        if (vx < -0.2) {
          setSidebarOpen(false);
          return;
        }
        if (vx > 0.2) {
          setSidebarOpen(true);
          return;
        }

        setSidebarOpen(releaseValue > SIDEBAR_WIDTH / 2);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: (evt, gestureState) => {
        const releaseValue = Math.min(
          SIDEBAR_WIDTH,
          Math.max(0, gestureStartX.current + gestureState.dx)
        );
        setSidebarOpen(releaseValue > SIDEBAR_WIDTH / 2);
      },
    })
  ).current;

  const handleNavigate = (path: Parameters<typeof router.push>[0]) => {
    setSidebarOpen(false);
    setTimeout(() => {
      router.push(path);
    }, 220);
  };

  return (
    <ThemedView style={styles.container} {...panResponder.panHandlers}>
      <Sidebar
        translateX={translateX}
        onNavigate={handleNavigate}
        panHandlers={panResponder.panHandlers}
      />

      <Animated.View
        style={[styles.mainContent, { transform: [{ translateX }] }]}
      >
        <Animated.View
          pointerEvents={sidebarOpen ? "auto" : "none"}
          style={[styles.darkenOverlay, { opacity: scrimOpacity }]}
        >
          <TouchableOpacity
            style={styles.scrimTouch}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        </Animated.View>

        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <ThemedView style={styles.header}>
            <TouchableOpacity
              style={styles.hamburgerButton}
              onPress={toggleSidebar}
            >
              <FontAwesome6 name="bars" size={30} color={iconColor} />
            </TouchableOpacity>
            <ThemedText
              type="title"
              style={[styles.headerTitle, { color: accent }]}
            >
              {title}
            </ThemedText>
          </ThemedView>
        </SafeAreaView>

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
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 0,
    paddingHorizontal: 24,
    gap: 12,
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 28,
  },
  darkenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    zIndex: 5,
  },
  divider: {
    alignSelf: "center",
    width: "90%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(131, 131, 131, 0.66)",
    marginTop: 8,
  },
  scrimTouch: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 8,
    // backgroundColor: 'red',
  },
  hamburgerButton: {
    padding: 4,
  },
});
