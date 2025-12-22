import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ThemedButton from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardEvent,
  PanResponder,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = Math.round(width * 0.8);

export default function WalletScreen() {
  const balance = 0;
  const { colorScheme } = useThemeController();
  const [amount, setAmount] = useState("");

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isKeyboardVisibleRef = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const animatedPadding = useRef(new Animated.Value(insets.bottom)).current;


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > 20 &&
          Math.abs(gestureState.dx) < Math.abs(gestureState.dy)
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy < -50) {
          inputRef.current?.focus();
        } else if (dy > 50) {
          if (isKeyboardVisibleRef.current) {
            Keyboard.dismiss();
            setAmount("");
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (event: KeyboardEvent) => {
      setKeyboardVisible(true);
      isKeyboardVisibleRef.current = true;
      Animated.timing(animatedPadding, {
        toValue: insets.bottom + 290,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    const onHide = (event: KeyboardEvent) => {
      setKeyboardVisible(false);
      isKeyboardVisibleRef.current = false;
      Animated.timing(animatedPadding, {
        toValue: insets.bottom,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    const showListener = Keyboard.addListener(showEvent, onShow);
    const hideListener = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [insets.bottom]);

  const accent =
    colorScheme === "dark"
      ? Colors.general.brandDarkMode
      : Colors.general.brandLightMode;
  const inputPlaceholder =
    colorScheme === "dark"
      ? Colors.general.inputPlaceholderDark
      : Colors.general.inputPlaceholderLight;
  
  const themeColors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const baseText = themeColors.text;
  const baseBackground = themeColors.background; 

  const accentTranslucent =
    colorScheme === "dark"
      ? "rgba(23, 255, 162, 0.1)"
      : "rgba(23, 255, 162, 0.12)";
  const redTranslucent = "rgba(255, 59, 48, 0.12)";
  const neutralTranslucent =
    colorScheme === "dark" ? "rgba(255,255,255,0.06)" : "#f2f2f2";

  const circleBorder =
    balance > 0
      ? accent
      : balance < 0
      ? Colors.general.red
      : Colors.general.borderLight;
  const circleBg =
    balance > 0
      ? accentTranslucent
      : balance < 0
      ? redTranslucent
      : neutralTranslucent;

  const sanitizeAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const normalized = cleaned.replace(/(\.)(?=.*\.)/g, "");
    setAmount(normalized);
  };

  return (
    <ThemedView style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.contentContainer}>
        <View style={styles.balanceWrapper}>
          <View
            style={[
              styles.balanceCircle,
              { borderColor: circleBorder, backgroundColor: circleBg },
            ]}
          >
            <ThemedText type="title" style={[styles.balanceText]}>
              {balance < 0 ? "-" : ""}$
              {Math.abs(balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </ThemedText>
          </View>
        </View>

        <Animated.View
          style={[styles.bottomSection, { paddingBottom: animatedPadding }]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              value={amount ? `$${amount}` : ""}
              onChangeText={sanitizeAmount}
              placeholder="$10.00"
              placeholderTextColor={inputPlaceholder}
              keyboardType="numeric"
              inputMode="decimal"
              blurOnSubmit
              onSubmitEditing={() => Keyboard.dismiss()}
              style={[styles.plainInput, { color: baseText }]}
            />
            
            <LinearGradient
              colors={colorScheme === "dark" ? [Colors.dark.background, 'rgba(17, 17, 17, 0)'] : [Colors.light.background, 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fadeLeft}
              pointerEvents="none" 
            />

            <LinearGradient
              colors={colorScheme === "dark" ? ['rgba(17, 17, 17, 0)', Colors.dark.background] : ['rgba(255,255,255,0)', Colors.light.background]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fadeRight}
              pointerEvents="none"
            />
          </View>

          {keyboardVisible && (
            <View style={styles.buttonWrapper}>
              <ThemedButton
                title={amount ? "Deposit" : "Cancel"}
                filled
                fullWidth
                fillColor={accent}
                onPress={() => {
                  if (!amount) Keyboard.dismiss();
                }}
              />
            </View>
          )}
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  balanceWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  balanceCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE / 2.5,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    padding: 16,
    gap: 6,
  },
  balanceText: {
    fontSize: 32,
    lineHeight: 72,
  },
  bottomSection: {
    marginTop: "auto",
    width: "100%",
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    height: 64,
  },
  plainInput: {
    width: "100%",
    height: "100%",
    fontSize: 42,
    paddingVertical: 0,
    lineHeight: 52,
    backgroundColor: "transparent",
    borderWidth: 0,
    textAlign: "center",
    fontFamily: "BBH_Bartle-Regular",
  },
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 30,
    zIndex: 1,
  },
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 30,
    zIndex: 1,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
});