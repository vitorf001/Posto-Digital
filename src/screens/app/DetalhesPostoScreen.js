import React from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  function temCoordenadas() {
    return (
      posto?.latitude !== null &&
      posto?.latitude !== undefined &&
      posto?.longitude !== null &&
      posto?.longitude !== undefined
    );
  }

  async function abrirNoMapa() {
    if (!temCoordenadas()) {
      Alert.alert('Localização indisponível', 'Este posto não possui latitude e longitude cadastradas.');
      return;
    }

    const latitude = Number(posto.latitude);
    const longitude = Number(posto.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert('Localização inválida', 'As coordenadas deste posto são inválidas.');
      return;
    }

    const label = encodeURIComponent(posto.nome || 'Posto');

    const url = Platform.select({
      ios: `maps://?q=${label}&ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    await abrirUrl(url);
  }

  async function comoChegar() {
    if (!temCoordenadas()) {
      Alert.alert('Localização indisponível', 'Este posto não possui latitude e longitude cadastradas.');
      return;
    }

    const latitude = Number(posto.latitude);
    const longitude = Number(posto.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert('Localização inválida', 'As coordenadas deste posto são inválidas.');
      return;
    }

    const url = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    await abrirUrl(url);
  }

  async function abrirUrl(url) {
    try {
      const podeAbrir = await Linking.canOpenURL(url);

      if (podeAbrir) {
        await Linking.openURL(url);
        return;
      }

      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${posto.latitude},${posto.longitude}`;
      await Linking.openURL(fallbackUrl);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapa.');
    }
  }

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
        <Ionicons
          name={getStatusIcon(posto.status)}
          size={24}
          color={getStatusColor(posto.status, colors)}
        />

        <Text style={[styles.statusText, { color: getStatusColor(posto.status, colors) }]}>
          {getStatusLabel(posto.status)}
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
          value={posto.endereco || 'Não informado'}
          colors={colors}
        />

        <InfoItem
          icon="map-outline"
          label="Coordenadas"
          value={
            temCoordenadas()
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

        {posto.operador ? (
          <InfoItem
            icon="business-outline"
            label="Origem/Operador"
            value={posto.operador}
            colors={colors}
          />
        ) : null}

        {posto.horario ? (
          <InfoItem
            icon="time-outline"
            label="Horário"
            value={posto.horario}
            colors={colors}
          />
        ) : null}
      </View>

      <AppButton
        title="Abrir no mapa"
        onPress={abrirNoMapa}
      />

      <AppButton
        title="Como chegar"
        variant="outline"
        onPress={comoChegar}
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

function getStatusLabel(status) {
  if (status === 'aprovado') {
    return 'Posto verificado';
  }

  if (status === 'openstreetmap') {
    return 'Encontrado no OpenStreetMap';
  }

  if (status === 'google') {
    return 'Encontrado no Google';
  }

  if (status === 'pendente') {
    return 'Pendente de aprovação';
  }

  if (status === 'rejeitado') {
    return 'Posto rejeitado';
  }

  return status ? `Status: ${status}` : 'Informação disponível';
}

function getStatusIcon(status) {
  if (status === 'aprovado') {
    return 'checkmark-circle-outline';
  }

  if (status === 'openstreetmap' || status === 'google') {
    return 'map-outline';
  }

  if (status === 'rejeitado') {
    return 'close-circle-outline';
  }

  return 'time-outline';
}

function getStatusColor(status, colors) {
  if (status === 'aprovado') {
    return colors.success;
  }

  if (status === 'rejeitado') {
    return colors.danger;
  }

  if (status === 'openstreetmap' || status === 'google') {
    return colors.warning;
  }

  return colors.primary;
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