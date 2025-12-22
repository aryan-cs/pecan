import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const STATS_DATA = ["1,234", "56%", "78", "91%", "$100", "$100"];
const STAT_LABELS = [
  "Bets Made",
  "Win Rate",
  "Parlays Made",
  "Hit Rate",
  "Earned",
  "Lost",
];
const PROFILE_PIC_SIZE = 150;

export default function ProfileScreen() {
  const { colorScheme } = useThemeController();
  const isDark = colorScheme === "dark";

  const brandColor = isDark
    ? Colors.general.brandDarkMode
    : Colors.general.brandLightMode;
  const profileIconColor = isDark ? "#3A3A3C" : "#E5E5EA";
  const subTextColor = "#8E8E93";

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    setImageUri(null);
  };

  const handleProfilePress = () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Update Profile Photo",
        "Choose an option",
        [
          { text: "Choose from Library", onPress: pickImage },
          { text: "Take Photo", onPress: takePhoto },
          { text: "Remove Photo", style: "destructive", onPress: removePhoto },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert("Update Profile Photo", "Choose an option", [
        { text: "Choose from Library", onPress: pickImage },
        { text: "Take Photo", onPress: takePhoto },
        { text: "Remove Photo", style: "destructive", onPress: removePhoto },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Pressable onPress={handleProfilePress}>
            <View
              style={[
                styles.profilePicContainer,
                {
                  backgroundColor: imageUri ? "transparent" : profileIconColor,
                },
              ]}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.profileImage}
                  resizeMode="contain"
                />
              ) : (
                <FontAwesome6 name="user" size={40} color={subTextColor} />
              )}

              {!imageUri && (
                <View style={styles.editBadge}>
                  <FontAwesome6 name="plus" size={14} color="white" />
                </View>
              )}
            </View>
          </Pressable>

          <View style={styles.userInfo}>
            <ThemedText type="title" style={styles.username}>
              @TheGoat
            </ThemedText>
            {/* NEW SUBTEXT ADDED HERE */}
            <ThemedText style={[styles.userSubtext, { color: subTextColor }]}>
              Winning since {today}.
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {STATS_DATA.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stat}</ThemedText>
              <ThemedText style={[styles.statSubtext, { color: subTextColor }]}>
                {STAT_LABELS[index].toUpperCase()}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomDesignContainer}>
        <View style={[styles.slantedBar, { backgroundColor: brandColor }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: -60,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  profilePicContainer: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: 20,
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  profileImage: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: 20,
  },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#a7a7a7ff",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  userInfo: {
    alignItems: "center",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
  },
  userSubtext: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  statItem: {
    width: (SCREEN_WIDTH - 48 - 20) / 2,
    alignItems: "center",
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  bottomDesignContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    zIndex: -1,
    elevation: -1,
    overflow: "hidden",
    pointerEvents: "none",
  },
  slantedBar: {
    position: "absolute",
    bottom: -150,
    left: "-25%",
    width: "150%",
    height: 300,
    transform: [{ rotate: "-10deg" }],
  },
});