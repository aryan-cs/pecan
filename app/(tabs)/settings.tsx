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
            Sensational feature, requires no description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>

          <View style={[styles.settingBox, { backgroundColor: containerColor }]}>
            <View style={styles.row}>
              <ThemedText style={{ fontSize: 17 }}>Another Setting</ThemedText>
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
            Here's a filler for another setting's description.
          </ThemedText>
          
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
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    marginVertical: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
});