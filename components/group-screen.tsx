import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { BRAND_DARK_MODE, BRAND_LIGHT_MODE } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutRectangle, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["Statistics", "My Bets", "Leaderboard", "Options"];

const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function GroupScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeController();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const subTextColor = colorScheme === "dark" ? "#8E8E93" : "#8E8E93";
  const borderColor = useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "border");
  const brandColor = colorScheme === "dark" ? BRAND_DARK_MODE : BRAND_LIGHT_MODE;

  const params = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const [tabLayouts, setTabLayouts] = useState<Record<string, LayoutRectangle>>({});
  const scrollRef = useRef<ScrollView>(null);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const [isReady, setIsReady] = useState(false); 

  const id = typeof params.id === "string" ? params.id : "";
  const name = typeof params.name === "string" ? params.name : "Unknown Group";
  const duration = typeof params.duration === "string" ? params.duration : "";
  const active = params.active === "true";

  const eventDuration = duration || "Long term";

  const createdAtTimestamp =
    typeof params.createdAt === "string"
      ? parseInt(params.createdAt, 10)
      : Date.now();
  const createdDate = new Date(createdAtTimestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const onTabPress = (tab: string) => {
    setSelectedTab(tab);
    const layout = tabLayouts[tab];
    if (layout) {
      Animated.parallel([
        Animated.spring(indicatorPosition, {
          toValue: layout.x,
          useNativeDriver: false, 
          tension: 80,
          friction: 12,
        }),
        Animated.spring(indicatorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          tension: 80,
          friction: 12,
        }),
      ]).start();
    }
  };

  const handleTabLayout = (tab: string, event: any) => {
    const { x, width, height, y } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [tab]: { x, width, height, y } }));
  };

  useEffect(() => {
    if (!isReady && tabLayouts[selectedTab]) {
      const layout = tabLayouts[selectedTab];
      indicatorPosition.setValue(layout.x);
      indicatorWidth.setValue(layout.width);
      setIsReady(true);
    }
  }, [tabLayouts, selectedTab, isReady]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "",
          animation: "slide_from_right",
          contentStyle: { backgroundColor: backgroundColor },
        }}
      />

      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={textColor}
            onPress={() => router.back()}
            style={{ marginLeft: -8 }}
          />

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: active ? brandColor : "#8E8E93",
              },
            ]}
          />
        </View>

        <View style={styles.mainInfo}>
          {/* UPDATED TITLE: Smaller font, max 2 lines, auto-shrink if needed */}
          <ThemedText 
            type="title" 
            style={styles.title} 
            numberOfLines={2} 
            adjustsFontSizeToFit
          >
            {name}
          </ThemedText>

          <ThemedText style={[styles.dateText, { color: subTextColor }]}>
            {eventDuration} event created on {createdDate}.
          </ThemedText>
        </View>

        <View style={[styles.tabsWrapper, { borderBottomColor: borderColor }]}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {isReady && (
              <Animated.View
                style={[
                  styles.floatingIndicator,
                  {
                    left: indicatorPosition,
                    width: indicatorWidth,
                  },
                ]}
              >
                 <View style={styles.activeIndicatorContainer}>
                      <LinearGradient
                        colors={[hexToRgba(brandColor, 0.3), "transparent"]}
                        style={styles.indicatorGlow}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                      />

                      <LinearGradient
                         colors={[backgroundColor, hexToRgba(backgroundColor, 0)]}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={[styles.sideMask, { left: -1 }]}
                      />

                       <LinearGradient
                         colors={[hexToRgba(backgroundColor, 0), backgroundColor]}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={[styles.sideMask, { right: -1 }]}
                      />
                      <View style={[styles.indicatorLine, { backgroundColor: brandColor }]} />
                    </View>
              </Animated.View>
            )}

            {TABS.map((tab) => {
              const isSelected = selectedTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => onTabPress(tab)}
                  onLayout={(e) => handleTabLayout(tab, e)}
                  style={styles.tabItem}
                >
                  <ThemedText
                    style={[
                      styles.tabText,
                      {
                        color: isSelected ? brandColor : subTextColor,
                        fontWeight: isSelected ? "700" : "500",
                        opacity: isSelected ? 1 : 0.7,
                      },
                    ]}
                  >
                    {tab}
                  </ThemedText>
                </Pressable>
              );
            })}

          </ScrollView>
        </View>

        <View style={styles.tabContentArea}>
          <ThemedText style={{ opacity: 0.5 }}>
            {selectedTab} is empty.
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mainInfo: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26, // Reduced from 32
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "500",
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    width: "100%",
    zIndex: 10, 
  },
  tabsScrollContent: {
    paddingHorizontal: 24,
    gap: 32,
  },
  tabItem: {
    paddingVertical: 6, 
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    letterSpacing: 0.2,
    zIndex: 10, 
  },
  floatingIndicator: {
    position: 'absolute',
    bottom: 0, 
    height: 2, 
  },
  activeIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: -20, 
    right: -20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 0, 
  },
  indicatorLine: {
    height: 1,
    width: '100%', 
    borderRadius: 2,
    zIndex: 3, 
  },
  indicatorGlow: {
    position: 'absolute',
    bottom: 1, 
    width: '100%',
    height: 20, 
    zIndex: 1, 
  },
  sideMask: {
    position: 'absolute',
    bottom: 1, 
    width: 80, 
    height: 50, 
    zIndex: 2, 
  },
  tabContentArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
    paddingHorizontal: 24,
    zIndex: 1,
  },
});