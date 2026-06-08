import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '../../components/AppHeader';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function AdminHomeScreen({ navigation }) {
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Painel Admin"
        subtitle="Gerencie postos, usuários e notícias do app."
      />

      <AdminCard
        icon="storefront-outline"
        title="Postos"
        description="Aprovar, revisar e gerenciar postos cadastrados"
        onPress={() => navigation.navigate('AdminPostos')}
        colors={colors}
      />

      <AdminCard
        icon="people-outline"
        title="Usuários"
        description="Visualizar usuários e permissões"
        onPress={() => navigation.navigate('AdminUsuarios')}
        colors={colors}
      />

      <AdminCard
        icon="newspaper-outline"
        title="Notícias"
        description="Cadastrar e gerenciar notícias"
        onPress={() => navigation.navigate('AdminNoticias')}
        colors={colors}
      />
    </View>
  );
}

function AdminCard({ icon, title, description, onPress, colors }) {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={26} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Ionicons name="chevron-forward-outline" size={22} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
    },

    iconBox: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },

    content: {
      flex: 1,
    },

    title: {
      fontSize: 17,
      fontWeight: '900',
      color: colors.text,
    },

    description: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
  });
}