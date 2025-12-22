import { ThemedText } from '@/components/themed-text';
import { useThemeController } from '@/context/theme-context';
import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SettingsScreen() {
  const { toggle, colorScheme } = useThemeController();
  const isDark = colorScheme === 'dark';

  const containerColor = isDark ? '#1C1C1E' : '#FFFFFF';
  
  const activeSwitchColor = 'BRAND_DARK_MODE'; 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.section}>

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

          <View>
          <Pressable 
            onPress={() => {}}
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
          <ThemedText style={styles.description}>Found a bug? Let us know. [NOT YET IMPLEMENTED]</ThemedText>
        </View>

        <View>
          <Pressable 
            onPress={() => console.log("Logging out...")}
            style={({ pressed }) => [
              styles.settingBox, 
              { backgroundColor: containerColor, opacity: pressed ? 0.7 : 1, alignItems: 'center' }
            ]}
          >
            <ThemedText style={{ fontSize: 17, color: '#FF3B30', fontWeight: '500' }}>
              Log Out
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.description}>Log out of your account. [NOT YET IMPLEMENTED]</ThemedText>
        </View>          
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    padding: -60,
    // backgroundColor: 'red',
  },
  scrollContent: {
    margin: 0,
    padding: 20,
  },
  header: {
    // marginBottom: 20,
    paddingHorizontal: 4,
  },
  section: {
    // marginBottom: 24,
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
});