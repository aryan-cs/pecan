import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeControllerProviderProps {
  initialScheme?: ColorSchemeName;
  children: React.ReactNode;
}

export function ThemeControllerProvider({ initialScheme, children }: ThemeControllerProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    initialScheme ?? Appearance.getColorScheme() ?? 'light'
  );

  const value = useMemo(
    () => ({
      colorScheme,
      toggle: () => setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [colorScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeController() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeController must be used within a ThemeControllerProvider');
  }
  return ctx;
}
