import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { NoticiaCard } from '../../components/NoticiaCard';
import { useNoticias } from '../../hooks/useNoticias';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../utils/formatDate';

export function NoticiasScreen() {
  const { noticias, loading, erro, recarregar } = useNoticias();
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (loading) {
    return <LoadingScreen message="Carregando notícias..." />;
  }

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Notícias"
        subtitle="Fique por dentro das novidades do Posto Digital."
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <FlatList
        data={noticias}
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
            icon="newspaper-outline"
            title="Nenhuma notícia encontrada"
            description="As novidades do app aparecerão aqui."
          />
        }
        renderItem={({ item }) => (
          <NoticiaCard
            noticia={{
              id: item.id,
              titulo: item.titulo,
              descricao: item.descricao,
              data: formatDate(item.criado_em),
            }}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    error: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 12,
    },
  });
}