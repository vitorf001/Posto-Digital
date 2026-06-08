import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '../hooks/useTheme';

export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'outline' && styles.outlineText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    button: {
      width: '100%',
      height: 52,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 6,
    },

    secondary: {
      backgroundColor: colors.secondary,
    },

    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },

    disabled: {
      opacity: 0.6,
    },

    text: {
      color: colors.mode === 'dark' ? colors.black : colors.white,
      fontSize: 16,
      fontWeight: '700',
    },

    outlineText: {
      color: colors.primary,
    },
  });
}