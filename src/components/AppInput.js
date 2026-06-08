import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      marginBottom: 14,
    },

    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },

    input: {
      height: 52,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 14,
      fontSize: 16,
      color: colors.text,
    },

    inputError: {
      borderColor: colors.danger,
    },

    error: {
      color: colors.danger,
      marginTop: 4,
      fontSize: 13,
    },
  });
}