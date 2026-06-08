import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function NotificacoesScreen() {
  const {
    notificacoes,
    loading,
    erro,
    naoLidas,
    recarregar,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoes();

  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (loading) {
    return <LoadingScreen message="Carregando notificações..." />;
  }

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Notificações"
        subtitle={
          naoLidas > 0
            ? `Você tem ${naoLidas} notificação(ões) não lida(s).`
            : 'Você está em dia com suas notificações.'
        }
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {notificacoes.length > 0 ? (
        <AppButton
          title="Marcar todas como lidas"
          variant="outline"
          onPress={marcarTodasComoLidas}
        />
      ) : null}

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={recarregar}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="Nenhuma notificação"
            description="Quando houver novidades, elas aparecerão aqui."
          />
        }
        renderItem={({ item }) => (
          <NotificacaoCard
            notificacao={item}
            onPress={() => marcarComoLida(item.id)}
            colors={colors}
          />
        )}
      />
    </View>
  );
}

function NotificacaoCard({ notificacao, onPress, colors }) {
  const styles = createStyles(colors);
  const iconName = getIconByTipo(notificacao.tipo);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !notificacao.lida && styles.cardNaoLido,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Ionicons name={iconName} size={22} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{notificacao.titulo}</Text>

          {!notificacao.lida ? <View style={styles.dot} /> : null}
        </View>

        <Text style={styles.message}>{notificacao.mensagem}</Text>
        <Text style={styles.date}>{notificacao.data}</Text>
      </View>
    </TouchableOpacity>
  );
}

function getIconByTipo(tipo) {
  if (tipo === 'preco') {
    return 'cash-outline';
  }

  if (tipo === 'posto') {
    return 'storefront-outline';
  }

  if (tipo === 'noticia') {
    return 'newspaper-outline';
  }

  return 'notifications-outline';
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
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
    },

    cardNaoLido: {
      borderColor: colors.primary,
      backgroundColor:
        colors.mode === 'dark'
          ? '#042F2E'
          : colors.surface,
    },

    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    content: {
      flex: 1,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },

    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: colors.primary,
      marginLeft: 8,
    },

    message: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    date: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },
  });
}