import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useMeuPosto } from '../../hooks/useMeuPosto';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function MeuPostoScreen({ navigation }) {
  const { posto, loading, erro, recarregar } = useMeuPosto();
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (loading) {
    return <LoadingScreen message="Carregando seu posto..." />;
  }

  if (!posto) {
    return (
      <View style={globalStyles.container}>
        <AppHeader
          title="Meu Posto"
          subtitle="Gerencie as informações do seu posto."
        />

        <EmptyState
          icon="storefront-outline"
          title="Nenhum posto encontrado"
          description="Você ainda não possui um posto cadastrado ou aprovado."
        />

        <AppButton
          title="Cadastrar posto"
          onPress={() => navigation.navigate('CadastrarPosto')}
        />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Meu Posto"
        subtitle="Gerencie as informações do seu posto."
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name="storefront-outline" size={30} color={colors.primary} />
        </View>

        <Text style={styles.nome}>{posto.nome}</Text>
        <Text style={styles.endereco}>{posto.endereco}</Text>

        <View style={[styles.statusBox, getStatusStyle(posto.status, styles)]}>
          <Ionicons
            name={posto.status === 'aprovado' ? 'checkmark-circle-outline' : 'time-outline'}
            size={18}
            color={getStatusColor(posto.status, colors)}
          />
          <Text style={[styles.statusText, getStatusTextStyle(posto.status, styles)]}>
            {posto.status}
          </Text>
        </View>
      </View>

      <View style={styles.precosCard}>
        <Text style={styles.sectionTitle}>Preços atuais</Text>

        <PrecoLinha label="Gasolina" valor={posto.gasolina} colors={colors} />
        <PrecoLinha label="Etanol" valor={posto.etanol} colors={colors} />
        <PrecoLinha label="Diesel" valor={posto.diesel} colors={colors} />
      </View>

      <AppButton
        title="Atualizar preços"
        onPress={() => navigation.navigate('AtualizarPrecos', { posto })}
      />

      <AppButton
        title="Recarregar"
        variant="outline"
        onPress={recarregar}
      />
    </View>
  );
}

function PrecoLinha({ label, valor, colors }) {
  const styles = createStyles(colors);

  return (
    <View style={styles.precoLinha}>
      <Text style={styles.precoLabel}>{label}</Text>
      <Text style={styles.precoValor}>{valor ? `R$ ${valor}` : '-'}</Text>
    </View>
  );
}

function getStatusColor(status, colors) {
  if (status === 'aprovado') {
    return colors.success;
  }

  if (status === 'rejeitado') {
    return colors.danger;
  }

  return colors.warning;
}

function getStatusStyle(status, styles) {
  if (status === 'aprovado') {
    return styles.statusAprovado;
  }

  if (status === 'rejeitado') {
    return styles.statusRejeitado;
  }

  return styles.statusPendente;
}

function getStatusTextStyle(status, styles) {
  if (status === 'aprovado') {
    return styles.statusTextAprovado;
  }

  if (status === 'rejeitado') {
    return styles.statusTextRejeitado;
  }

  return styles.statusTextPendente;
}

function createStyles(colors) {
  return StyleSheet.create({
    error: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 12,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      marginBottom: 18,
    },

    iconBox: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    nome: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
    },

    endereco: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },

    statusBox: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderWidth: 1,
    },

    statusAprovado: {
      backgroundColor: colors.surfaceSoft,
      borderColor: colors.success,
    },

    statusPendente: {
      backgroundColor: colors.mode === 'dark' ? '#451A03' : '#FEF3C7',
      borderColor: colors.warning,
    },

    statusRejeitado: {
      backgroundColor: colors.mode === 'dark' ? '#450A0A' : '#FEE2E2',
      borderColor: colors.danger,
    },

    statusText: {
      marginLeft: 6,
      fontWeight: '800',
      textTransform: 'uppercase',
    },

    statusTextAprovado: {
      color: colors.success,
    },

    statusTextPendente: {
      color: colors.warning,
    },

    statusTextRejeitado: {
      color: colors.danger,
    },

    precosCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 12,
    },

    precoLinha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    precoLabel: {
      fontSize: 15,
      color: colors.textSecondary,
    },

    precoValor: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.primary,
    },
  });
}