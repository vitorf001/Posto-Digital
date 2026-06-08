import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';

export function useGlobalStyles() {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
  });
}