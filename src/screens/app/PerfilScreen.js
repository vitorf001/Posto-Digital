import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';

export function PerfilScreen({ navigation }) {
  const {
    usuario,
    perfil,
    tipoUsuario,
    isAdmin,
    isDonoPosto,
    logout,
  } = useAuth();

  const { colors, isDarkMode, toggleTheme } = useTheme();
  const globalStyles = useGlobalStyles();
  const styles = createStyles(colors);

  function confirmarSair() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  }

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Perfil"
        subtitle="Gerencie sua conta e seus atalhos."
      />

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={32} color={colors.primary} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {perfil?.nome || 'Usuário'}
          </Text>

          <Text style={styles.userEmail}>
            {perfil?.email || usuario?.email || 'email não informado'}
          </Text>

          <Text style={styles.userType}>
            Tipo: {tipoUsuario || 'usuario'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Atalhos</Text>

      <MenuItem
        icon="add-circle-outline"
        title="Cadastrar Posto"
        description="Envie um posto para aprovação"
        onPress={() => navigation.navigate('CadastrarPosto')}
        colors={colors}
      />

      {(isDonoPosto || isAdmin) ? (
        <>
          <MenuItem
            icon="storefront-outline"
            title="Meu Posto"
            description="Gerencie seu posto cadastrado"
            onPress={() => navigation.navigate('MeuPosto')}
            colors={colors}
          />

          <MenuItem
            icon="cash-outline"
            title="Atualizar Preços"
            description="Informe os preços atuais"
            onPress={() => navigation.navigate('AtualizarPrecos')}
            colors={colors}
          />
        </>
      ) : null}

      {isAdmin ? (
        <MenuItem
          icon="settings-outline"
          title="Painel Admin"
          description="Acesse a área administrativa"
          onPress={() => navigation.navigate('AdminHome')}
          colors={colors}
        />
      ) : null}

      <MenuItem
        icon={isDarkMode ? 'sunny-outline' : 'moon-outline'}
        title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
        description="Alternar aparência do aplicativo"
        onPress={toggleTheme}
        colors={colors}
      />

      <View style={styles.logoutArea}>
        <AppButton
          title="Sair da conta"
          variant="outline"
          onPress={confirmarSair}
        />
      </View>
    </View>
  );
}

function MenuItem({ icon, title, description, onPress, colors }) {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={22}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    userCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 22,
    },

    avatar: {
      width: 62,
      height: 62,
      borderRadius: 18,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },

    userInfo: {
      flex: 1,
      justifyContent: 'center',
    },

    userName: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
    },

    userEmail: {
      marginTop: 4,
      fontSize: 14,
      color: colors.textSecondary,
    },

    userType: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 12,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },

    menuIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    menuContent: {
      flex: 1,
    },

    menuTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },

    menuDescription: {
      marginTop: 3,
      fontSize: 13,
      color: colors.textSecondary,
    },

    logoutArea: {
      marginTop: 10,
    },
  });
}