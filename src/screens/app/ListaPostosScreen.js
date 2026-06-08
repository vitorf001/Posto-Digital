import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { PostoCard } from '../../components/PostoCard';
import { usePostos } from '../../hooks/usePostos';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function ListaPostosScreen({ navigation }) {
  const { postos, loading, erro, recarregar } = usePostos();
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  function abrirDetalhes(posto) {
    navigation.navigate('DetalhesPosto', { posto });
  }

  if (loading) {
    return <LoadingScreen message="Carregando postos..." />;
  }

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Postos"
        subtitle="Compare os preços dos combustíveis próximos a você."
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <FlatList
        data={postos}
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
            icon="storefront-outline"
            title="Nenhum posto encontrado"
            description="Quando houver postos cadastrados, eles aparecerão aqui."
          />
        }
        renderItem={({ item }) => (
          <PostoCard
            posto={item}
            onPress={() => abrirDetalhes(item)}
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