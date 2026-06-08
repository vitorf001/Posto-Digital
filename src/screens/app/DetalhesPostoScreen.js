import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function DetalhesPostoScreen({ route }) {
  const { posto } = route.params;
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <AppHeader
        title={posto.nome}
        subtitle={posto.endereco}
      />

      <View style={styles.statusCard}>
        <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
        <Text style={styles.statusText}>
          {posto.status === 'aprovado' ? 'Posto verificado' : `Status: ${posto.status}`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preços dos combustíveis</Text>

        <FuelCard
          name="Gasolina"
          price={posto.gasolina}
          colors={colors}
        />

        <FuelCard
          name="Etanol"
          price={posto.etanol}
          colors={colors}
        />

        <FuelCard
          name="Diesel"
          price={posto.diesel}
          colors={colors}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <InfoItem
          icon="location-outline"
          label="Endereço"
          value={posto.endereco}
          colors={colors}
        />

        <InfoItem
          icon="navigate-outline"
          label="Distância"
          value={posto.distancia ? `${posto.distancia} km de você` : 'Não informada'}
          colors={colors}
        />

        <InfoItem
          icon="map-outline"
          label="Coordenadas"
          value={
            posto.latitude && posto.longitude
              ? `${posto.latitude}, ${posto.longitude}`
              : 'Não informadas'
          }
          colors={colors}
        />

        {posto.telefone ? (
          <InfoItem
            icon="call-outline"
            label="Telefone"
            value={posto.telefone}
            colors={colors}
          />
        ) : null}
      </View>

      <AppButton
        title="Abrir no mapa"
        onPress={() => {}}
      />

      <AppButton
        title="Como chegar"
        variant="outline"
        onPress={() => {}}
      />
    </ScrollView>
  );
}

function FuelCard({ name, price, colors }) {
  const styles = createStyles(colors);

  return (
    <View style={styles.fuelCard}>
      <View>
        <Text style={styles.fuelName}>{name}</Text>
        <Text style={styles.fuelSubtitle}>Preço à vista</Text>
      </View>

      <Text style={styles.fuelPrice}>
        {price ? `R$ ${price}` : '-'}
      </Text>
    </View>
  );
}

function InfoItem({ icon, label, value, colors }) {
  const styles = createStyles(colors);

  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    content: {
      paddingBottom: 32,
    },

    statusCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSoft,
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statusText: {
      marginLeft: 8,
      fontSize: 15,
      fontWeight: '700',
      color: colors.success,
      textTransform: 'capitalize',
    },

    section: {
      marginBottom: 22,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 12,
    },

    fuelCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    fuelName: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },

    fuelSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
    },

    fuelPrice: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.primary,
    },

    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },

    infoIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    infoContent: {
      flex: 1,
    },

    infoLabel: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    infoValue: {
      marginTop: 3,
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
  });
}