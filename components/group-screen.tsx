import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { BRAND_DARK_MODE, BRAND_LIGHT_MODE } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeController();

  const backgroundColor = useThemeColor({}, "background");

  const params = useLocalSearchParams();

  const id = typeof params.id === "string" ? params.id : "";
  const name = typeof params.name === "string" ? params.name : "Unknown Group";
  const duration = typeof params.duration === "string" ? params.duration : "";
  const active = params.active === "true";

  const createdAtTimestamp =
    typeof params.createdAt === "string"
      ? parseInt(params.createdAt, 10)
      : Date.now();
  const createdDate = new Date(createdAtTimestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const subTextColor = colorScheme === "dark" ? "#8E8E93" : "#8E8E93";

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
                backgroundColor: active
                  ? colorScheme === "dark"
                    ? BRAND_DARK_MODE
                    : BRAND_LIGHT_MODE
                  : "#8E8E93",
              },
            ]}
          />
        </View>

        <View style={styles.mainInfo}>
          <ThemedText type="title" style={styles.title}>
            {name}
          </ThemedText>

          <ThemedText style={[styles.dateText, { color: subTextColor }]}>
            Group created on {createdDate}.
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
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    marginBottom: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mainInfo: {
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "500",
  },
});
