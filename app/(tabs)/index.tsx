import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FAB_SIZE = 64;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DURATIONS = [
  "5 minutes",
  "30 minutes",
  "60 minutes",
  "1 day",
  "Unlimited",
];

export default function HomeScreen() {
  const { colorScheme } = useThemeController();
  const insets = useSafeAreaInsets();

  // 1. Control visibility separately from the animation
  const [modalVisible, setModalVisible] = useState(false);
  
  // 2. Animation Value: 0 = Hidden, 1 = Visible
  const animValue = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [customDate, setCustomDate] = useState(new Date());

  const accent =
    colorScheme === "dark"
      ? Colors.general.brandDarkMode
      : Colors.general.brandLightMode;
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const inputBg = colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7";
  const placeholderColor = colorScheme === "dark" ? "#8e8e93" : "#aeaeb2";
  const modalBg = colorScheme === "dark" ? "#000" : "#fff";

  // 3. Helper to open modal with animation
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 4. Helper to close modal with animation
  const closeModal = () => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Only hide the modal view AFTER animation completes
      setModalVisible(false);
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(
        "Name required",
        "Please enter a name before creating the group."
      );
      return;
    }
    const finalDuration =
      selectedDuration === "Custom"
        ? customDate.toISOString()
        : selectedDuration;

    console.log({ name, duration: finalDuration });
    closeModal();
    setName("");
    setSelectedDuration(DURATIONS[0]);
  };

  // 5. Interpolate animations
  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5], // Fades from 0 to 0.5 opacity
  });

  const slideUp = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0], // Slides from bottom (offscreen) to 0
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.tagline}>
        Making "I told you so" just a little bit sweeter.
      </ThemedText>

      <Pressable
        style={[
          styles.fab,
          { backgroundColor: accent, bottom: insets.bottom + 24 },
        ]}
        hitSlop={12}
        onPress={openModal}
      >
        <FontAwesome6 name="plus" size={22} color="#0e0e0e" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        // 6. Disable default slide so we can control it manually
        animationType="none" 
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          {/* 7. Animated Backdrop: Fades in independently */}
          <Animated.View 
            style={[
              styles.backdrop, 
              { opacity: backdropOpacity }
            ]} 
          >
            <Pressable style={{ flex: 1 }} onPress={closeModal} />
          </Animated.View>

          {/* 8. Animated Content: Slides up independently */}
          <Animated.View
            style={[
              styles.modalContentWrapper,
              { 
                transform: [{ translateY: slideUp }],
                // Make sure this sits roughly at the bottom
                justifyContent: "flex-end", 
                flex: 1,
                pointerEvents: "box-none" // Lets clicks pass through empty space to backdrop
              },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: modalBg, height: "90%" },
              ]}
            >
              <View style={styles.modalHeader}>
                <ThemedText type="subtitle">New Group</ThemedText>
                <Pressable onPress={closeModal} hitSlop={10}>
                  <Ionicons name="close" size={24} color={textColor} />
                </Pressable>
              </View>

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
              >
                <ScrollView
                  bounces={false}
                  contentContainerStyle={[
                    styles.formContainer,
                    { paddingBottom: insets.bottom + 20 },
                  ]}
                >
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Name</ThemedText>
                    <View
                      style={[
                        styles.inputWrapper,
                        { backgroundColor: inputBg },
                      ]}
                    >
                      <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholderTextColor={placeholderColor}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        textAlignVertical="center"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Duration</ThemedText>
                    <View style={styles.chipContainer}>
                      {DURATIONS.map((duration) => {
                        const isSelected = selectedDuration === duration;
                        return (
                          <Pressable
                            key={duration}
                            style={[
                              styles.chip,
                              {
                                backgroundColor: isSelected ? accent : inputBg,
                              },
                            ]}
                            onPress={() => setSelectedDuration(duration)}
                          >
                            <ThemedText
                              style={{
                                color: isSelected ? "#000" : textColor,
                                fontWeight: isSelected ? "600" : "400",
                              }}
                            >
                              {duration}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <View style={{ marginTop: 8 }}>
                    <Pressable
                      style={[styles.saveButton, { backgroundColor: accent }]}
                      onPress={handleSave}
                    >
                      <ThemedText style={styles.saveButtonText}>
                        Create
                      </ThemedText>
                    </Pressable>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  tagline: {
    textAlign: "center",
    fontSize: 20,
  },
  fab: {
    position: "absolute",
    right: FAB_SIZE / 4,
    bottom: FAB_SIZE / 4,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    // No background color here!
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 1,
  },
  modalContentWrapper: {
    zIndex: 2,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  formContainer: {
    gap: 12,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputWrapper: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0e0e0e",
  },
});