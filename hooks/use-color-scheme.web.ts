import { useThemeController } from '@/context/theme-context';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

/**
 * Web picks this file; wire it to the same theme controller so toggling works in browsers.
 * Preserve hydration guard to avoid mismatches during SSR/SSG.
 */
export function useColorScheme() {
  const { colorScheme } = useThemeController();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return Appearance.getColorScheme() ?? 'light';
  }

  return colorScheme ?? 'light';
}
