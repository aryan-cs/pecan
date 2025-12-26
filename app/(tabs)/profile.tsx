import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/theme-context";
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [username, setUsername] = useState("???");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (data) {
          if (data.username) setUsername(data.username);
          if (data.avatar_url) setImageUri(data.avatar_url);
        }
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };
    getProfile();
  }, []);

  const deleteUserFiles = async (userId: string) => {
    try {
      const { data: list, error: listError } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (listError) throw listError;

      if (list && list.length > 0) {
        const filesToRemove = list.map((x) => `${userId}/${x.name}`);

        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove(filesToRemove);

        if (removeError) throw removeError;
      }
    } catch (error) {
      console.log("Cleanup warning:", error);
    }
  };

  const uploadToSupabase = async (uri: string) => {
    try {
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await deleteUserFiles(user.id);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      const fileData = decode(base64);

      const fileName = `${user.id}/${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, fileData, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (dbError) throw dbError;

      setImageUri(publicUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed", (error as any).message);
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await uploadToSupabase(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera access.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await uploadToSupabase(result.assets[0].uri);
    }
  };

  const removePhoto = async () => {
    try {
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await deleteUserFiles(user.id);

        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: null })
          .eq("id", user.id);

        if (error) throw error;

        setImageUri(null);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not remove photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePress = () => {
    const options = [
      { text: "Choose from Library", onPress: pickImage },
      { text: "Take Photo", onPress: takePhoto },
      { text: "Remove Photo", style: "destructive", onPress: removePhoto },
      { text: "Cancel", style: "cancel" },
    ];

    if (Platform.OS === "android") {
      options.pop();
      Alert.alert("Update Profile Photo", "Choose an option", options as any, {
        cancelable: true,
      });
    } else {
      Alert.alert("Update Profile Photo", "Choose an option", options as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Pressable onPress={handleProfilePress} disabled={uploading}>
            <View
              style={[
                styles.profilePicContainer,
                {
                  backgroundColor: imageUri ? "transparent" : profileIconColor,
                },
              ]}
            >
              {uploading ? (
                <ActivityIndicator color={brandColor} />
              ) : imageUri ? (
                <Image
                  key={imageUri}
                  source={{ uri: imageUri }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome6 name="user" size={40} color={subTextColor} />
              )}

              {!imageUri && !uploading && (
                <View style={styles.editBadge}>
                  <FontAwesome6 name="plus" size={14} color="white" />
                </View>
              )}
            </View>
          </Pressable>

          <View style={styles.userInfo}>
            <ThemedText
              type="title"
              style={styles.username}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              @{username}
            </ThemedText>
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
    marginBottom: 30,
    marginTop: 10,
  },
  profilePicContainer: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: 20,
    overflow: "hidden",
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
    width: "100%",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  userSubtext: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
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
    height: 275,
    transform: [{ rotate: "-10deg" }],
  },
});
