import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  toggle: () => void;
  followSystem: boolean;
  setFollowSystem: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeControllerProviderProps {
  initialScheme?: ColorSchemeName;
  children: React.ReactNode;
}

export function ThemeControllerProvider({ initialScheme, children }: ThemeControllerProviderProps) {
  const [followSystem, setFollowSystem] = useState<boolean>(true);
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    initialScheme ?? Appearance.getColorScheme() ?? 'light'
  );

  useEffect(() => {
    const listener = ({ colorScheme: sys }: { colorScheme: ColorSchemeName }) => {
      if (followSystem) {
        setColorScheme(sys ?? 'light');
      }
    };
    const sub = Appearance.addChangeListener(listener as any);
    return () => {
      // Try to remove subscription if available
      // @ts-expect-error cleanup for RN versions
      if (sub && typeof sub.remove === 'function') sub.remove();
    };
  }, [followSystem]);

  const value = useMemo(
    () => ({
      colorScheme,
      toggle: () => {
        setFollowSystem(false);
        setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      },
      followSystem,
      setFollowSystem,
    }),
    [colorScheme, followSystem]
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
