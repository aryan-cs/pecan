import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  title: string;
  style?: ViewStyle | ViewStyle[];
  fullWidth?: boolean;
  filled?: boolean;
  fillColor?: string;
};

export default function ThemedButton({
  onPress,
  title,
  style,
  fullWidth,
  filled,
  fillColor,
}: Props) {
  const color = useThemeColor({}, "text");
  const accent = useThemeColor({}, "tint");
  const bg = fillColor ?? accent;
  const scheme = useColorScheme();
  const filledTextColor =
    scheme === "dark" ? useThemeColor({}, "background") : "#fff";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        filled ? { backgroundColor: bg } : { backgroundColor: "transparent" },
        fullWidth ? styles.fullWidth : undefined,
        style,
      ]}
    >
      <ThemedText
        type={filled ? "defaultSemiBold" : "link"}
        style={[filled ? { color: filledTextColor } : { color }]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
    paddingVertical: 12,
  },
});
