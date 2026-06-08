import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { AppInput } from '../../components/AppInput';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';
import {
  converterPrecoParaNumero,
  formatarPrecoDigitado,
} from '../../utils/formatCurrency';
import { validarPreco } from '../../utils/validators';

export function CalculadoraScreen() {
  const [gasolina, setGasolina] = useState('');
  const [etanol, setEtanol] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  function calcular() {
    Keyboard.dismiss();

    setErro('');
    setResultado(null);

    if (!gasolina.trim() || !etanol.trim()) {
      setErro('Informe o preço da gasolina e do etanol.');
      return;
    }

    if (!validarPreco(gasolina) || !validarPreco(etanol)) {
      setErro('Digite preços válidos. Exemplo: 5,89');
      return;
    }

    const precoGasolina = converterPrecoParaNumero(gasolina);
    const precoEtanol = converterPrecoParaNumero(etanol);

    const proporcao = precoEtanol / precoGasolina;
    const compensaEtanol = proporcao <= 0.7;

    setResultado({
      proporcao,
      combustivel: compensaEtanol ? 'Etanol' : 'Gasolina',
      descricao: compensaEtanol
        ? 'O etanol está compensando mais neste momento.'
        : 'A gasolina está compensando mais neste momento.',
    });
  }

  function limpar() {
    setGasolina('');
    setEtanol('');
    setResultado(null);
    setErro('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Calculadora"
          subtitle="Compare etanol e gasolina usando a regra dos 70%."
        />

        <View style={styles.card}>
          <AppInput
            label="Preço da gasolina"
            placeholder="Ex: 5,89"
            value={gasolina}
            onChangeText={(text) => setGasolina(formatarPrecoDigitado(text))}
            keyboardType="decimal-pad"
          />

          <AppInput
            label="Preço do etanol"
            placeholder="Ex: 4,19"
            value={etanol}
            onChangeText={(text) => setEtanol(formatarPrecoDigitado(text))}
            keyboardType="decimal-pad"
          />

          {erro ? <Text style={styles.error}>{erro}</Text> : null}

          <AppButton title="Calcular" onPress={calcular} />

          <AppButton
            title="Limpar"
            variant="outline"
            onPress={limpar}
          />
        </View>

        {resultado ? (
          <View style={styles.resultCard}>
            <View style={styles.resultIcon}>
              <Ionicons name="analytics-outline" size={28} color={colors.primary} />
            </View>

            <Text style={styles.resultLabel}>Melhor opção</Text>
            <Text style={styles.resultFuel}>{resultado.combustivel}</Text>

            <Text style={styles.resultDescription}>
              {resultado.descricao}
            </Text>

            <View style={styles.percentBox}>
              <Text style={styles.percentText}>
                Etanol equivale a {(resultado.proporcao * 100).toFixed(1)}% da gasolina
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Regra geral: o etanol costuma compensar quando custa até 70% do preço da gasolina.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      paddingBottom: 32,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    error: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 10,
    },

    resultCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },

    resultIcon: {
      width: 62,
      height: 62,
      borderRadius: 18,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    resultLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },

    resultFuel: {
      marginTop: 4,
      fontSize: 32,
      fontWeight: '900',
      color: colors.primary,
    },

    resultDescription: {
      marginTop: 8,
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },

    percentBox: {
      marginTop: 16,
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    percentText: {
      color: colors.text,
      fontWeight: '700',
    },

    infoCard: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceSoft,
      borderRadius: 16,
      padding: 16,
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: colors.border,
    },

    infoText: {
      flex: 1,
      marginLeft: 10,
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
  });
}