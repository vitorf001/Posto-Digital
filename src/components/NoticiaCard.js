import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';

export function NoticiaCard({ noticia, onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Ionicons name="newspaper-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo}>{noticia.titulo}</Text>
        <Text style={styles.descricao}>{noticia.descricao}</Text>

        {noticia.data ? (
          <Text style={styles.data}>{noticia.data}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
    },

    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    content: {
      flex: 1,
    },

    titulo: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },

    descricao: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    data: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
  });
}