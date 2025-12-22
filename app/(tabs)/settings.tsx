import { ThemedText } from '@/components/themed-text';
import { BRAND_DARK_MODE } from '@/constants/theme';
import { useThemeController } from '@/context/theme-context';
import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { toggle, colorScheme } = useThemeController();
  const isDark = colorScheme === 'dark';

  const containerColor = isDark ? '#1C1C1E' : '#FFFFFF';
  
  const activeSwitchColor = BRAND_DARK_MODE; 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.section}>
          
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
            Adjust the appearance of the application to reduce glare and improve readability in low-light environments.
          </ThemedText>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    height: '100%',
    alignSelf: 'center',
  },
  scrollContent: {

  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  section: {
    marginBottom: 24,
  },
  settingBox: {
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    marginTop: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
});