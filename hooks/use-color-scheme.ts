import { useThemeController } from '@/context/theme-context';

export function useColorScheme() {
	const { colorScheme } = useThemeController();
	return colorScheme;
}
