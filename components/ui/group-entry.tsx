import { ThemedText } from "@/components/ui/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_HEIGHT = 120; // Matches the height in styles
const MARGIN_BOTTOM = 16; // Matches the marginBottom in styles

interface GroupEntryProps {
  id?: string;
  name: string;
  duration?: string;
  createdAt: number;
  active: boolean;
  onPress?: () => void;
  onLeave?: () => void;
  // New props for animation coordination
  isDeleting?: boolean;
  onDeleteAnimationComplete?: () => void;
}

export default function GroupEntry({
  name,
  duration,
  createdAt,
  active,
  onPress,
  onLeave,
  isDeleting,
  onDeleteAnimationComplete,
}: GroupEntryProps) {
  const cardBg = useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "card");
  const pressedcardBg = useThemeColor(
    { light: "#F2F2F7", dark: "#2C2C2E" },
    "card"
  );
  const [timeLeft, setTimeLeft] = useState("");

  // Animation Values
  const translateX = useRef(new Animated.Value(0)).current;
  const itemHeight = useRef(new Animated.Value(ITEM_HEIGHT)).current;
  const itemMarginBottom = useRef(new Animated.Value(MARGIN_BOTTOM)).current;
  const itemOpacity = useRef(new Animated.Value(1)).current;
  const SLIDE_OUT_DURATION = 250;
  const SLIDE_UP_DURATION = SLIDE_OUT_DURATION - 50;

  // -- DELETION ANIMATION LOGIC --
  useEffect(() => {
    if (isDeleting) {
      Animated.sequence([
        // 1. Slide element off-screen to the left
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH,
          duration: SLIDE_OUT_DURATION,
          useNativeDriver: false, // Layout properties usually require false
          easing: Easing.out(Easing.ease),
        }),
        // 2. Collapse the space (Height & Margin) and Fade out
        Animated.parallel([
          Animated.timing(itemHeight, {
            toValue: 0,
            duration: SLIDE_UP_DURATION,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(itemMarginBottom, {
            toValue: 0,
            duration: SLIDE_UP_DURATION,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(itemOpacity, {
            toValue: 0,
            duration: SLIDE_UP_DURATION,
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => {
        // 3. Signal parent to remove data
        if (onDeleteAnimationComplete) {
          onDeleteAnimationComplete();
        }
      });
    }
  }, [isDeleting]);

  // -- TIMER LOGIC (Unchanged) --
  useEffect(() => {
    if (!duration || duration === "Unlimited") {
      setTimeLeft("∞");
      return;
    }
    const getDurationMs = () => {
      const isIsoDate = duration.includes("-") && duration.includes("T");
      if (isIsoDate) {
        return new Date(duration).getTime() - createdAt;
      } else {
        const parts = duration.split(" ");
        const amount = parseInt(parts[0], 10);
        const unit = parts[1];
        let durationMs = 0;
        if (unit?.startsWith("minute")) durationMs = amount * 60 * 1000;
        if (unit?.startsWith("hour")) durationMs = amount * 60 * 60 * 1000;
        if (unit?.startsWith("day")) durationMs = amount * 24 * 60 * 60 * 1000;
        return durationMs;
      }
    };
    const formatTime = (ms: number) => {
      if (ms <= 0) return "00:00:00";
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      const hDisplay = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
      const mDisplay = `${minutes.toString().padStart(2, "0")}:`;
      const sDisplay = seconds.toString().padStart(2, "0");
      return `${hDisplay}${mDisplay}${sDisplay}`;
    };
    if (!active) {
      const totalDuration = getDurationMs();
      setTimeLeft(formatTime(totalDuration));
      return;
    }
    const durationMs = getDurationMs();
    const targetTime = createdAt + durationMs;
    const calculateTick = () => {
      const now = Date.now();
      const diff = targetTime - now;
      setTimeLeft(formatTime(diff));
    };
    calculateTick();
    const interval = setInterval(calculateTick, 1000);
    return () => clearInterval(interval);
  }, [duration, createdAt, active]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.8],
      extrapolate: "clamp",
    });

    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <View style={{ width: 80, flexDirection: "row" }}>
        <Animated.View
          style={[styles.rightAction, { transform: [{ translateX: trans }] }]}
        >
          <Pressable onPress={onLeave} style={styles.actionContent}>
            <Animated.View
              style={{ transform: [{ scale }], alignItems: "center" }}
            >
              <Ionicons name="log-out-outline" size={26} color="white" />
              <ThemedText style={styles.actionText}>Leave</ThemedText>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          // Bind animated values
          transform: [{ translateX }],
          height: itemHeight,
          marginBottom: itemMarginBottom,
          opacity: itemOpacity,
        },
      ]}
    >
      <Swipeable renderRightActions={renderRightActions}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.pressableContent,
            { backgroundColor: pressed ? pressedcardBg : cardBg },
          ]}
        >
          <View style={styles.topRow}>
            {timeLeft ? (
              <ThemedText
                style={[styles.duration, !active && styles.inactiveDuration]}
              >
                {timeLeft}
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.bottomRow}>
            <ThemedText type="title" style={styles.name} numberOfLines={2}>
              {name}
            </ThemedText>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom and height removed here as they are now animated styles
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    backgroundColor: "#FF3B30",
  },
  pressableContent: {
    height: ITEM_HEIGHT, // Content has fixed height
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "space-between",
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
    marginLeft: 4,
  },
  duration: {
    fontSize: 15,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    textAlign: "right",
  },
  inactiveDuration: {
    opacity: 0.4,
  },
  rightAction: {
    backgroundColor: "#FF3B30",
    flex: 1,
    width: "200%",
    marginLeft: "-200%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  actionContent: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});