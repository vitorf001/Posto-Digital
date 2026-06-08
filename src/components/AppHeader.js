import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';

export function AppHeader({ title, subtitle }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
    },

    subtitle: {
      marginTop: 6,
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
}