import GroupEntry from "@/components/ui/group-entry";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  Switch,
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
  const router = useRouter();
  const { colorScheme } = useThemeController();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;
  const fabColor =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;

  const [name, setName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [customDate, setCustomDate] = useState(new Date());

  const [startImmediately, setStartImmediately] = useState(false);

  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const [groups, setGroups] = useState<
    {
      id: string;
      name: string;
      duration: string;
      createdAt: number;
      active: boolean;
    }[]
  >([
    {
      id: "hardcoded-test-1",
      name: "Isla Nublar",
      duration: "5 minutes",
      createdAt: Date.now(),
      active: false,
    },
    {
      id: "hardcoded-test-2",
      name: "Isla Sorna",
      duration: "30 minutes",
      createdAt: Date.now(),
      active: true,
    },
    {
      id: "hardcoded-test-3",
      name: "Isla Matanceros",
      duration: "60 minutes",
      createdAt: Date.now(),
      active: true,
    },
    {
      id: "hardcoded-test-4",
      name: "Isla Muerta",
      duration: "1 day",
      createdAt: Date.now(),
      active: true,
    },
    {
      id: "hardcoded-test-5",
      name: "Isla Pena",
      duration: "Unlimited",
      createdAt: Date.now(),
      active: false,
    },
    {
      id: "hardcoded-test-6",
      name: "Isla Tacano",
      duration: "Unlimited",
      createdAt: Date.now(),
      active: false,
    },
    {
      id: "hardcoded-test-7",
      name: "Mantah Corp Island",
      duration: "Unlimited",
      createdAt: Date.now(),
      active: false,
    },
  ]);

  const accent =
    colorScheme === "dark"
      ? Colors.general.brandDarkMode
      : Colors.general.brandLightMode;
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const inputBg = colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7";
  const placeholderColor = colorScheme === "dark" ? "#8e8e93" : "#aeaeb2";
  const modalBg = colorScheme === "dark" ? "#000" : "#fff";

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setName("");
      setSelectedDuration(DURATIONS[0]);
      setStartImmediately(false);
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

    const newGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      duration: finalDuration,
      createdAt: Date.now(),
      active: startImmediately,
    };

    setGroups((prev) => [newGroup, ...prev]);
    closeModal();
  };

  const handleLeaveGroup = (id: string) => {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group? This will remove it from your list.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            setDeletingIds((prev) => [...prev, id]);
          },
        },
      ]
    );
  };

  const finalizeLeaveGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setDeletingIds((prev) => prev.filter((dId) => dId !== id));
  };

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  const slideUp = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{
          width: "100%",
          marginTop: 0,
          paddingTop: 18,
          paddingHorizontal: 24,
        }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {groups.length === 0 ? (
          <ThemedText style={{ textAlign: "center", opacity: 0.6 }}>
            No groups yet — tap + to create one.
          </ThemedText>
        ) : (
          groups.map((g) => (
            <GroupEntry
              key={g.id}
              name={g.name}
              duration={g.duration}
              createdAt={g.createdAt}
              active={g.active}
              onPress={() => {
                if (deletingIds.includes(g.id)) return;
                router.push({
                  pathname: "/item/[id]",
                  params: {
                    id: g.id,
                    name: g.name,
                    duration: g.duration,
                    createdAt: g.createdAt.toString(),
                    active: g.active.toString(),
                  },
                });
              }}
              onLeave={() => handleLeaveGroup(g.id)}
              isDeleting={deletingIds.includes(g.id)}
              onDeleteAnimationComplete={() => finalizeLeaveGroup(g.id)}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        style={[
          styles.fab,
          { backgroundColor: accent, bottom: insets.bottom + 24 },
        ]}
        hitSlop={12}
        onPress={openModal}
      >
        <FontAwesome6 name="plus" size={22} color={fabColor} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          >
            <Pressable style={{ flex: 1 }} onPress={closeModal} />
          </Animated.View>

          <Animated.View
            style={[
              styles.modalContentWrapper,
              {
                transform: [{ translateY: slideUp }],
                justifyContent: "flex-end",
                flex: 1,
                pointerEvents: "box-none",
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

                  <View style={[styles.inputGroup, styles.toggleRow]}>
                    <ThemedText style={styles.label}>
                      Start immediately?
                    </ThemedText>
                    <Switch
                      trackColor={{ false: inputBg, true: accent }}
                      thumbColor={"#fff"}
                      ios_backgroundColor={inputBg}
                      onValueChange={setStartImmediately}
                      value={startImmediately}
                    />
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
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
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
  modalOverlay: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 1,
  },
  modalContentWrapper: { zIndex: 2 },
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
  formContainer: { gap: 20 },
  inputGroup: { gap: 12 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, opacity: 0.7, fontWeight: "600", marginLeft: 4 },
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
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
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
  saveButtonText: { fontSize: 17, fontWeight: "bold", color: "#0e0e0e" },
});
