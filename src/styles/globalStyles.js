import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
});