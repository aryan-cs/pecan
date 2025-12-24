import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { BRAND_DARK_MODE, BRAND_LIGHT_MODE } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  LayoutRectangle,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
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

  const containerColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";
  const activeSwitchColor = BRAND_DARK_MODE;

  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const subTextColor = colorScheme === "dark" ? "#8E8E93" : "#8E8E93";
  const borderColor = useThemeColor(
    { light: "#E5E5EA", dark: "#38383A" },
    "border"
  );
  const brandColor =
    colorScheme === "dark" ? BRAND_DARK_MODE : BRAND_LIGHT_MODE;

  const params = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const [tabLayouts, setTabLayouts] = useState<Record<string, LayoutRectangle>>(
    {}
  );
  const scrollRef = useRef<ScrollView>(null);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const [isReady, setIsReady] = useState(false);

  const id = typeof params.id === "string" ? params.id : "";
  const name = typeof params.name === "string" ? params.name : "Unknown Group";
  const duration = typeof params.duration === "string" ? params.duration : "";
  const active = params.active === "true";

  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 86400000));

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

  const handleLeave = () => {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group? You will lose your progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  const handleInvite = () => {
    Alert.alert("Invite", "Share link functionality coming soon!");
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || targetDate;
    setTargetDate(currentDate);
  };

  const renderContent = () => {
    if (selectedTab === "Options") {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <View
              style={[styles.settingBox, { backgroundColor: containerColor }]}
            >
              <View style={styles.row}>
                <ThemedText
                  style={{
                    fontSize: 17,
                    color: active ? brandColor : textColor,
                  }}
                >
                  {active ? "Event is active!" : "Start Time"}
                </ThemedText>

                {active ? (
                  <Switch
                    trackColor={{ false: "#767577", true: activeSwitchColor }}
                    thumbColor={"#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    value={true}
                    disabled={false}
                    onValueChange={() => {}}
                    style={{ display: "none" }}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginRight: -6,
                    }}
                  >
                    <DateTimePicker
                      testID="datePicker"
                      value={targetDate}
                      mode="date"
                      display="compact"
                      onChange={onDateChange}
                      accentColor={brandColor}
                      textColor={textColor}
                      themeVariant={colorScheme ?? "light"}
                      style={{}}
                    />
                    <DateTimePicker
                      testID="timePicker"
                      value={targetDate}
                      mode="time"
                      display="compact"
                      onChange={onDateChange}
                      accentColor={brandColor}
                      textColor={textColor}
                      themeVariant={colorScheme ?? "light"}
                      style={{}}
                    />
                  </View>
                )}
              </View>
            </View>

            <ThemedText style={styles.description}>
              {active
                ? "This event is currently live. Good luck!"
                : "Set the countdown for when this event begins."}
            </ThemedText>

            <Pressable
              onPress={handleInvite}
              style={({ pressed }) => [
                styles.settingBox,
                { backgroundColor: containerColor, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.row}>
                <ThemedText style={{ fontSize: 17 }}>Invite Friends</ThemedText>
                <FontAwesome6 name="chevron-right" size={14} color="#8E8E93" />
              </View>
            </Pressable>
            <ThemedText style={styles.description}>
              Share the invite code with your friends. [NOT YET IMPLEMENTED]
            </ThemedText>

            <Pressable
              onPress={handleLeave}
              style={({ pressed }) => [
                styles.settingBox,
                { backgroundColor: containerColor, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[styles.row, { justifyContent: "center" }]}>
                <ThemedText
                  style={{ fontSize: 17, color: "#FF3B30", fontWeight: "500" }}
                >
                  Leave Group
                </ThemedText>
              </View>
            </Pressable>
            <ThemedText style={[styles.description, { textAlign: "left" }]}>
              Exit this group and remove it from your list.
            </ThemedText>
          </View>

          <ThemedText style={styles.versionText}>Group ID: {id}</ThemedText>
        </ScrollView>
      );
    }

    return (
      <View style={styles.placeholderContainer}>
        <ThemedText style={{ opacity: 0.5 }}>
          {selectedTab} content coming soon...
        </ThemedText>
      </View>
    );
  };

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
                  <View
                    style={[
                      styles.indicatorLine,
                      { backgroundColor: brandColor },
                    ]}
                  />
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

        <View style={styles.tabContentArea}>{renderContent()}</View>
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
    fontSize: 26,
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
    position: "absolute",
    bottom: 0,
    height: 2,
  },
  activeIndicatorContainer: {
    position: "absolute",
    bottom: 0,
    left: -20,
    right: -20,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 0,
  },
  indicatorLine: {
    height: 1,
    width: "100%",
    borderRadius: 2,
    zIndex: 3,
  },
  indicatorGlow: {
    position: "absolute",
    bottom: 1,
    width: "100%",
    height: 20,
    zIndex: 1,
  },
  sideMask: {
    position: "absolute",
    bottom: 1,
    width: 80,
    height: 50,
    zIndex: 2,
  },
  tabContentArea: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  settingBox: {
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  versionText: {
    textAlign: "center",
    marginTop: 0,
    opacity: 0.3,
    fontSize: 12,
  },
});
