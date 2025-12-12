import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeController } from '@/context/theme-context';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.round(width * 0.65);

export default function WalletScreen() {
  // TODO: replace with real balance from state/API.
  const balance = 100;
  const { colorScheme } = useThemeController();
  const [amount, setAmount] = useState('');

  const accent =
    colorScheme === 'dark'
      ? Colors.general.brandDarkMode
      : Colors.general.brandLightMode;
  const surface = colorScheme === 'dark' ? Colors.general.surfaceDark : Colors.general.surfaceLight;
  const border = colorScheme === 'dark' ? Colors.general.borderDark : Colors.general.borderLight;
  const inputBg = colorScheme === 'dark' ? Colors.general.inputBgDark : Colors.general.inputBgLight;
  const inputPlaceholder = colorScheme === 'dark'
    ? Colors.general.inputPlaceholderDark
    : Colors.general.inputPlaceholderLight;
  const baseText = Colors[colorScheme === 'dark' ? 'dark' : 'light'].text;
  const accentTranslucent =
    colorScheme === 'dark'
      ? 'rgba(23, 255, 162, 0.1)'
      : 'rgba(23, 255, 162, 0.12)';
  const redTranslucent = 'rgba(255, 59, 48, 0.12)';
  const neutralTranslucent = colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : '#f2f2f2';

  const balanceColor = balance === 0 ? baseText : balance > 0 ? accent : Colors.general.red;
  const circleBorder = balance > 0 ? accent : balance < 0 ? Colors.general.red : border;
  const circleBg = balance > 0 ? accentTranslucent : balance < 0 ? redTranslucent : neutralTranslucent;

  const sanitizeAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const normalized = cleaned.replace(/(\.)(?=.*\.)/g, '');
    setAmount(normalized);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.balanceWrapper}>
        <View style={[styles.balanceCircle, { borderColor: circleBorder, backgroundColor: circleBg }]}>
          <ThemedText type="defaultSemiBold" style={[styles.balanceText, { color: balanceColor }]}>
            {balance < 0 ? '-' : ''}${Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </ThemedText>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.inputRow}>
          <ThemedText style={styles.inputPrefix}>$</ThemedText>
          <TextInput
            value={amount}
            onChangeText={sanitizeAmount}
            placeholder="0.00"
            placeholderTextColor={inputPlaceholder}
            keyboardType="numeric"
            inputMode="decimal"
            style={[
              styles.input,
              {
                borderColor: border,
                backgroundColor: inputBg,
                color: baseText,
              },
            ]}
          />
        </View>

        <View style={styles.actionsRow}>
          <FundingButton label="Crypto" icon="bitcoin" color={accent} surface={surface} border={border} />
          <FundingButton label="Apple Pay" icon="apple-pay" iconSet="brands" color={accent} surface={surface} border={border} />
          <FundingButton label="Credit" icon="credit-card" color={accent} surface={surface} border={border} />
        </View>
      </View>
    </ThemedView>
  );
}

type FundingButtonProps = {
  label: string;
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  iconSet?: 'brands' | 'regular' | 'solid';
  color: string;
  surface: string;
  border: string;
};

function FundingButton({ label, icon, iconSet, color, surface, border }: FundingButtonProps) {
  const handlePress = () => {
    Alert.alert('Payment method coming soon!', undefined, [{ text: 'OK' }]);
  };

  return (
    <Pressable style={[styles.button, { backgroundColor: surface, borderColor: border }]} onPress={handlePress}>
      <FontAwesome6
        name={icon as any}
        size={22}
        color={color}
        // Use brands set for Apple Pay to show the branded glyph when available.
        {...(iconSet === 'brands' ? { type: 'brands' as const } : { solid: true })}
      />
      <ThemedText style={styles.buttonLabel}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  balanceWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 86,
  },
  balanceCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    padding: 16,
    gap: 6,
  },
  balanceText: {
    fontSize: 42,
  },
  bottomSection: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 32,
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginTop: 12,
  },
  inputPrefix: {
    fontSize: 20,
    fontFamily: 'Inter-Regular',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
  actionsRow: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
