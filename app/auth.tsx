import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useThemeController } from '@/context/theme-context';
import { supabase } from '@/lib/supabase';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AuthScreen() {
  const { colorScheme } = useThemeController();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  // --- Form State ---
  const [sEmail, setSEmail] = useState('');
  const [sUsername, setSUsername] = useState('');
  const [sPassword, setSPassword] = useState('');
  
  const [lIdentity, setLIdentity] = useState(''); // Can be Email OR Username
  const [lPassword, setLPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(true);

  // --- Animations ---
  const animValue = useRef(new Animated.Value(0)).current;

  // Colors
  const themeBg = isDark ? Colors.dark.background : Colors.light.background;
  const brandBg = isDark ? Colors.general.brandDarkMode : Colors.general.brandLightMode;
  
  const themeText = isDark ? Colors.dark.text : Colors.light.text;
  const brandTextColor = Colors.dark.background;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isSignup ? 0 : 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isSignup]);

  // Interpolations
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH],
  });

  const toggleTextColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [themeText, brandTextColor],
  });

  // --- Handlers ---
  // Inside app/auth.tsx

  async function handleSignup() {
    if (!sEmail || !sUsername || !sPassword) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }
    setLoading(true);
    
    // 1. Normalize: Remove spaces & force lowercase
    const cleanUsername = sUsername.trim().toLowerCase();
    const cleanEmail = sEmail.trim();

    // 2. Pre-Check: Does this username already exist?
    // We use .eq() because we store everything in lowercase now.
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (existingUser) {
      Alert.alert('Unavailable', 'That username is already taken.');
      setLoading(false);
      return;
    }

    // 3. Create Account
    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: sPassword,
      options: { 
        data: { username: cleanUsername }, // Save as lowercase
        emailRedirectTo: 'pecan://auth/callback' 
      },
    });

    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Check your inbox for verification!');
  }

  async function handleLogin() {
    if (!lIdentity || !lPassword) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }
    setLoading(true);
    
    let signInEmail = lIdentity;

    // 1. Check if input is NOT an email (assuming it's a username)
    if (!lIdentity.includes('@')) {
      // 2. Resolve Username -> Email via 'profiles' table
      // Note: This requires a public 'profiles' table in Supabase 
      // with 'username' and 'email' columns.
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', lIdentity)
        .single();

      if (error || !data) {
        Alert.alert('Login Failed', 'Username not found.');
        setLoading(false);
        return;
      }
      signInEmail = data.email;
    }

    // 3. Sign in with the resolved Email
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: lPassword,
    });
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
  }

  return (
    <View style={styles.container}>
      <View style={styles.safeContent}>
        
        {/* --- Sliding Container --- */}
        <Animated.View style={[styles.slider, { transform: [{ translateX }] }]}>
          
          {/* PAGE 1: SIGN UP */}
          <View style={[
            styles.page, 
            { 
              backgroundColor: themeBg,
              paddingTop: insets.top, 
              paddingBottom: insets.bottom 
            }
          ]}>
            <View style={styles.formSection}>
              <ThemedText style={styles.hugeHeader}>Sign Up.</ThemedText>
              
              <TextInput
                style={[styles.bigInput, { color: themeText }]}
                placeholder="Email"
                placeholderTextColor={isDark ? '#555' : '#CCC'}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={sEmail}
                onChangeText={setSEmail}
              />
              
              <TextInput
                style={[styles.bigInput, { color: themeText }]}
                placeholder="Username"
                placeholderTextColor={isDark ? '#555' : '#CCC'}
                autoCapitalize="none"
                returnKeyType="next"
                value={sUsername}
                // Regex: Allow only letters, numbers, dot, underscore, dash. No spaces.
                onChangeText={(text) => {
                    const cleaned = text.replace(/[^a-zA-Z0-9._-]/g, '');
                    setSUsername(cleaned);
                }}
              />
              
              <TextInput
                style={[styles.bigInput, { color: themeText }]}
                placeholder="Password"
                placeholderTextColor={isDark ? '#555' : '#CCC'}
                secureTextEntry
                returnKeyType="go"
                value={sPassword}
                onChangeText={setSPassword}
                onSubmitEditing={handleSignup}
              />
            </View>
          </View>

          {/* PAGE 2: LOG IN */}
          <View style={[
            styles.page, 
            { 
              backgroundColor: brandBg,
              paddingTop: insets.top, 
              paddingBottom: insets.bottom 
            }
          ]}>
            <View style={styles.formSection}>
              <ThemedText style={[styles.hugeHeader, { color: brandTextColor }]}>Log In.</ThemedText>
              
              <TextInput
                style={[styles.bigInput, { color: brandTextColor }]}
                // Updated Placeholder
                placeholder="Username"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={lIdentity}
                onChangeText={setLIdentity}
              />
              
              <TextInput
                style={[styles.bigInput, { color: brandTextColor }]}
                placeholder="Password"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                secureTextEntry
                returnKeyType="go"
                value={lPassword}
                onChangeText={setLPassword}
                onSubmitEditing={handleLogin}
              />
            </View>
          </View>

        </Animated.View>

        {/* --- Bottom Controls --- */}
        <View style={[
          styles.bottomBar, 
          { paddingBottom: Math.max(insets.bottom, 20) } 
        ]}>
          
          <Pressable
            onPress={isSignup ? handleSignup : handleLogin}
            style={({ pressed }) => [
              styles.actionButton,
              { 
                 backgroundColor: isSignup ? brandBg : Colors.light.text,
                 opacity: pressed ? 0.9 : 1
              }
            ]}
          >
            {loading ? (
              <ActivityIndicator color={isSignup ? Colors.dark.background : brandBg} />
            ) : (
              <FontAwesome6 
                name="check" 
                size={28} 
                color={isSignup ? Colors.dark.background : brandBg} 
              />
            )}
          </Pressable>

          <Pressable onPress={() => setIsSignup(!isSignup)} style={styles.switchButton}>
            <Animated.Text style={[styles.switchText, { color: toggleTextColor }]}>
              {isSignup ? "Been here before? Log In." : "New here? Sign Up."}
            </Animated.Text>
          </Pressable>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
    overflow: 'hidden',
  },
  slider: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'flex-start',
  },
  formSection: {
    gap: 24,
    marginTop: '15%',
  },
  hugeHeader: {
    fontSize: 60,
    fontWeight: '800',
    height: 'auto',
    paddingTop: 10,
    lineHeight: 70,
    marginBottom: 0,
    fontFamily: 'BBH_Bartle-Regular',
  },
  bigInput: {
    fontSize: 24,
    fontFamily: 'BBH_Bartle-Regular',
    width: '110%',
    paddingVertical: 10,
    marginLeft: -32,
    textAlign: 'right',
    height: 50,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    gap: 20,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'relative',
    left: '50%',
    marginLeft: -36,
    marginBottom: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  switchButton: {
    alignItems: 'center',
    padding: 10,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '600',
  },
});