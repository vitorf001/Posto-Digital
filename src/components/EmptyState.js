import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';

export function EmptyState({
  icon = 'alert-circle-outline',
  title = 'Nada encontrado',
  description = 'Não encontramos informações para exibir.',
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textSecondary} />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },

    title: {
      marginTop: 16,
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },

    description: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
}