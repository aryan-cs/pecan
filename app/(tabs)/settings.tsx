import { ThemedText } from '@/components/ui/themed-text';
import { BRAND_DARK_MODE } from '@/constants/theme';
import { useThemeController } from '@/context/theme-context';
import { supabase } from '@/lib/supabase'; // Import Supabase
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { toggle, colorScheme } = useThemeController();
  const isDark = colorScheme === 'dark';

  // State for "Report Error" Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [errorText, setErrorText] = useState('');

  const containerColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const activeSwitchColor = BRAND_DARK_MODE; 

  // --- Handlers ---
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error logging out', error.message);
    }
    // _layout.tsx will handle redirect to /auth automatically
  };

  const handleReportSubmit = () => {
    // In a real app, you would send this to your backend or email service
    console.log("Report submitted:", errorText);
    setErrorText('');
    setModalVisible(false);
    Alert.alert("Thank you", "Your report has been submitted.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.section}>

          {/* Developer Mode */}
          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Developer Mode</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: activeSwitchColor }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {}}
                value={true}
              />
            </View>
          </View>
          <ThemedText style={styles.description}>
            Big things under way.
          </ThemedText>
          
          {/* Dark Mode */}
          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Dark Mode</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: activeSwitchColor }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggle}
                value={isDark}
              />
            </View>
          </View>
          <ThemedText style={styles.description}>
            Sensational feature, requires no description.
          </ThemedText>

          {/* Push Notifications */}
          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Push Notifications</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: activeSwitchColor }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {}}
                value={false}
              />
            </View>
          </View>
          <ThemedText style={styles.description}>
            We promise we won't spam you like a crazy ex. [NOT YET IMPLEMENTED]
          </ThemedText>

          {/* Report an Error */}
          <View>
            <Pressable 
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => [
                styles.settingBox, 
                { backgroundColor: containerColor, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={styles.row}>
                <ThemedText style={{ fontSize: 17 }}>Report an Error</ThemedText>
                <FontAwesome6 name="chevron-right" size={14} color="#8E8E93" />
              </View>
            </Pressable>
            <ThemedText style={styles.description}>Found a bug? Let us know.</ThemedText>
          </View>

          {/* Log Out */}
          <View>
            <Pressable 
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.settingBox, 
                { backgroundColor: containerColor, opacity: pressed ? 0.7 : 1, alignItems: 'center' }
              ]}
            >
              <ThemedText style={{ fontSize: 17, color: '#FF3B30', fontWeight: '500' }}>
                Log Out
              </ThemedText>
            </Pressable>
            <ThemedText style={styles.description}>Log out of your account.</ThemedText>
          </View>          
          
        </View>
      </ScrollView>

      {/* --- Native-Style Modal for Reporting --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F2' }]}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>Report an Issue</ThemedText>
            <ThemedText style={styles.modalSubtitle}>Describe the error you encountered.</ThemedText>
            
            <TextInput
              style={[
                styles.modalInput, 
                { 
                  backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', 
                  color: textColor 
                }
              ]}
              placeholder="Type your message..."
              placeholderTextColor="#8E8E93"
              multiline
              value={errorText}
              onChangeText={setErrorText}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: '#007AFF', fontSize: 17 }}>Cancel</ThemedText>
              </Pressable>
              <View style={styles.modalButtonDivider} />
              <Pressable style={styles.modalButton} onPress={handleReportSubmit}>
                <ThemedText style={{ color: '#007AFF', fontSize: 17, fontWeight: '600' }}>Submit</ThemedText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: -60,
  },
  scrollContent: {
    margin: 0,
    padding: 20,
  },
  section: {
    marginVertical: 16,
    padding: 0,
  },
  settingBox: {
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: 270,
    borderRadius: 14,
    alignItems: 'center',
    paddingTop: 20,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 17,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  modalInput: {
    width: 238,
    height: 60,
    borderRadius: 5,
    padding: 8,
    fontSize: 13,
    marginBottom: 16,
    textAlignVertical: 'top',
    borderColor: '#3a3a3c',
    borderWidth: 0.5,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#3d3d40',
    width: '100%',
    height: 44,
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonDivider: {
    width: 0.5,
    backgroundColor: '#3d3d40',
    height: '100%',
  },
});