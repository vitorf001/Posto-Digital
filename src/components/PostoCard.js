import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';

export function PostoCard({ posto, onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="storefront-outline" size={22} color={colors.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.nome}>{posto.nome}</Text>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.endereco}>{posto.endereco}</Text>
          </View>
        </View>
      </View>

      <View style={styles.precos}>
        <View style={styles.precoItem}>
          <Text style={styles.precoLabel}>Gasolina</Text>
          <Text style={styles.precoValor}>
            {posto.gasolina ? `R$ ${posto.gasolina}` : '-'}
          </Text>
        </View>

        <View style={styles.precoItem}>
          <Text style={styles.precoLabel}>Etanol</Text>
          <Text style={styles.precoValor}>
            {posto.etanol ? `R$ ${posto.etanol}` : '-'}
          </Text>
        </View>
      </View>

      {posto.distancia ? (
        <View style={styles.distancia}>
          <Ionicons name="navigate-outline" size={14} color={colors.primary} />
          <Text style={styles.distanciaText}>{posto.distancia} km de você</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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

    info: {
      flex: 1,
    },

    nome: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },

    endereco: {
      flex: 1,
      marginLeft: 4,
      fontSize: 14,
      color: colors.textSecondary,
    },

    precos: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },

    precoItem: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    precoLabel: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    precoValor: {
      marginTop: 4,
      fontSize: 18,
      fontWeight: '800',
      color: colors.primary,
    },

    distancia: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },

    distanciaText: {
      marginLeft: 5,
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
  });
}