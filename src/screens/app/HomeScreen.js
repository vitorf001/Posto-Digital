import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useHomeResumo } from '../../hooks/useHomeResumo';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function HomeScreen({ navigation }) {
  const { resumo, loading, erro, recarregar } = useHomeResumo();
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (loading) {
    return <LoadingScreen message="Carregando início..." />;
  }

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={recarregar}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <AppHeader
        title="Posto Digital"
        subtitle="Encontre postos, compare preços e acompanhe novidades."
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="car-sport-outline" size={32} color={colors.primary} />
        </View>

        <Text style={styles.heroTitle}>Economize no combustível</Text>
        <Text style={styles.heroText}>
          Compare preços de gasolina, etanol e diesel antes de abastecer.
        </Text>

        <AppButton
          title="Ver postos próximos"
          onPress={() => navigation.navigate('ListaPostos')}
        />
      </View>

      <Text style={styles.sectionTitle}>Resumo</Text>

      <View style={styles.statsRow}>
        <ResumoCard
          icon="storefront-outline"
          label="Postos aprovados"
          value={String(resumo.totalPostos)}
          colors={colors}
        />

        <ResumoCard
          icon="cash-outline"
          label="Menor gasolina"
          value={resumo.menorGasolina ? `R$ ${resumo.menorGasolina}` : '-'}
          colors={colors}
        />
      </View>

      <View style={styles.statsRow}>
        <ResumoCard
          icon="leaf-outline"
          label="Menor etanol"
          value={resumo.menorEtanol ? `R$ ${resumo.menorEtanol}` : '-'}
          colors={colors}
        />

        <ResumoCard
          icon="newspaper-outline"
          label="Notícias"
          value={String(resumo.totalNoticias)}
          colors={colors}
        />
      </View>

      <Text style={styles.sectionTitle}>Atalhos rápidos</Text>

      <View style={styles.shortcutsGrid}>
        <ShortcutCard
          icon="map-outline"
          title="Mapa"
          onPress={() => navigation.navigate('Mapa')}
          colors={colors}
        />

        <ShortcutCard
          icon="calculator-outline"
          title="Calcular"
          onPress={() => navigation.navigate('Calculadora')}
          colors={colors}
        />

        <ShortcutCard
          icon="newspaper-outline"
          title="Notícias"
          onPress={() => navigation.navigate('Noticias')}
          colors={colors}
        />

        <ShortcutCard
          icon="person-outline"
          title="Perfil"
          onPress={() => navigation.navigate('Perfil')}
          colors={colors}
        />
      </View>

      <Text style={styles.sectionTitle}>Melhor preço encontrado</Text>

      {resumo.melhorPostoGasolina ? (
        <TouchableOpacity
          style={styles.bestCard}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('DetalhesPosto', {
              posto: resumo.melhorPostoGasolina,
            })
          }
        >
          <View style={styles.bestHeader}>
            <View style={styles.bestIcon}>
              <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
            </View>

            <View style={styles.bestInfo}>
              <Text style={styles.bestTitle}>
                {resumo.melhorPostoGasolina.nome}
              </Text>
              <Text style={styles.bestSubtitle}>
                Gasolina mais barata entre os postos aprovados
              </Text>
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color={colors.textSecondary}
            />
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Gasolina</Text>
            <Text style={styles.priceValue}>
              R$ {resumo.melhorPostoGasolina.gasolina}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum preço disponível</Text>
          <Text style={styles.emptyText}>
            Quando houver postos aprovados, o melhor preço aparecerá aqui.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Última notícia</Text>

      {resumo.ultimaNoticia ? (
        <TouchableOpacity
          style={styles.newsCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Noticias')}
        >
          <Text style={styles.newsTitle}>{resumo.ultimaNoticia.titulo}</Text>
          <Text style={styles.newsText}>{resumo.ultimaNoticia.descricao}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma notícia publicada</Text>
          <Text style={styles.emptyText}>
            As últimas novidades aparecerão aqui.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function ResumoCard({ icon, label, value, colors }) {
  const styles = createStyles(colors);

  return (
    <View style={styles.resumoCard}>
      <View style={styles.resumoIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>

      <Text style={styles.resumoValue}>{value}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

function ShortcutCard({ icon, title, onPress, colors }) {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.shortcutCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.shortcutIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>

      <Text style={styles.shortcutTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    content: {
      paddingBottom: 32,
    },

    error: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 12,
    },

    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 22,
    },

    heroIcon: {
      width: 64,
      height: 64,
      borderRadius: 18,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    heroTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 8,
    },

    heroText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 14,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 12,
      marginTop: 4,
    },

    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },

    resumoCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    resumoIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },

    resumoValue: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.text,
    },

    resumoLabel: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
    },

    shortcutsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 18,
    },

    shortcutCard: {
      width: '47.8%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },

    shortcutIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },

    shortcutTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },

    bestCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    bestHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    bestIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    bestInfo: {
      flex: 1,
    },

    bestTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },

    bestSubtitle: {
      marginTop: 3,
      fontSize: 13,
      color: colors.textSecondary,
    },

    priceBox: {
      marginTop: 14,
      backgroundColor: colors.background,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    priceLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },

    priceValue: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.primary,
    },

    newsCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },

    newsTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },

    newsText: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },

    emptyText: {
      marginTop: 6,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
}