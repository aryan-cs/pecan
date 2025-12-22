import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface GroupEntryProps {
  id?: string;
  name: string;
  duration?: string;
  createdAt: number;
  onPress?: () => void;
}

export default function GroupEntry({
  name,
  duration,
  createdAt,
  onPress,
}: GroupEntryProps) {
  const cardBg = useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "card");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!duration || duration === "Unlimited") {
      setTimeLeft("∞");
      return;
    }

    const calculateTime = () => {
      let targetTime = 0;

      const isIsoDate = duration.includes("-") && duration.includes("T");

      if (isIsoDate) {
        targetTime = new Date(duration).getTime();
      } else {
        const parts = duration.split(" ");
        const amount = parseInt(parts[0], 10);
        const unit = parts[1];

        let durationMs = 0;
        if (unit?.startsWith("minute")) durationMs = amount * 60 * 1000;
        if (unit?.startsWith("hour")) durationMs = amount * 60 * 60 * 1000;
        if (unit?.startsWith("day")) durationMs = amount * 24 * 60 * 60 * 1000;

        targetTime = createdAt + durationMs;
      }

      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hDisplay = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
      const mDisplay = `${minutes.toString().padStart(2, "0")}:`;
      const sDisplay = seconds.toString().padStart(2, "0");

      setTimeLeft(`${hDisplay}${mDisplay}${sDisplay}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [duration, createdAt]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.topRow}>
          {timeLeft ? (
            <ThemedText style={styles.duration}>{timeLeft}</ThemedText>
          ) : null}
        </View>

        <View style={styles.bottomRow}>
          <ThemedText type="title" style={styles.name} numberOfLines={2}>
            {name}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  card: {
    height: 120,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  topRow: {
    width: "100%",
    alignItems: "flex-end",
  },
  bottomRow: {
    width: "100%",
    alignItems: "flex-start",
  },
  name: {
    fontStyle: "italic",
    fontSize: 20,
  },
  duration: {
    fontSize: 15,
    fontWeight: "500",
    opacity: 0.6,
    fontVariant: ["tabular-nums"],
    textAlign: "right",
  },
});
