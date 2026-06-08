import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

import { useTheme } from '../hooks/useTheme';

export function LoadingScreen({ message = 'Carregando...' }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },

    text: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textSecondary,
    },
  });
}