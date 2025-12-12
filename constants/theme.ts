/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const brandDarkMode = '#17ffa2';
const brandLightMode = '#06d482ff';
export const BRAND_DARK_MODE = brandDarkMode;
export const BRAND_LIGHT_MODE = brandLightMode;

const tintColorLight = brandLightMode;
const tintColorDark = brandDarkMode;

export const Colors = {
  light: {
    text: '#0e0e0eff',
    background: '#ebebebff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    sidebarBackground: '#f5f5f5ff',
  },
  dark: {
    text: '#ffffffff',
    background: '#050505ff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    sidebarBackground: '#121212ff',
  },
  general: {
    brandDarkMode,
    brandLightMode,
    surfaceLight: '#ffffff',
    surfaceDark: 'rgba(255,255,255,0.06)',
    borderLight: '#d0d0d0',
    borderDark: 'rgba(255,255,255,0.18)',
    inputBgLight: '#ffffff',
    inputBgDark: '#0f0f0f',
    inputPlaceholderLight: 'rgba(0,0,0,0.45)',
    inputPlaceholderDark: 'rgba(255,255,255,0.55)',
    error: '#ff3b30',
    warning: '#ffc400ff',
    success: '#34c759',
    green: '#34c759',
    red: '#ff3b30',
    blue: '#0a84ff',
    yellow: '#ffc400ff',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
