import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import * as Location from 'expo-location';

import { enviarNotificacaoLocal } from '../../services/notificacoesAppService';
import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { AppInput } from '../../components/AppInput';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';
import { cadastrarPosto } from '../../services/postosService';
import { validarTextoObrigatorio, validarPreco } from '../../utils/validators';
import { formatarPrecoDigitado } from '../../utils/formatCurrency';

export function CadastrarPostoScreen({ navigation }) {
    const { usuario } = useAuth();
    const globalStyles = useGlobalStyles();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [gasolina, setGasolina] = useState('');
    const [etanol, setEtanol] = useState('');
    const [diesel, setDiesel] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [erro, setErro] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);

    async function pegarLocalizacaoAtual() {
        try {
            setErro('');
            setBuscandoLocalizacao(true);

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permissão necessária',
                    'Permita o acesso à localização para preencher a posição do posto.'
                );
                return;
            }

            const localizacao = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setLatitude(String(localizacao.coords.latitude).replace('.', ','));
            setLongitude(String(localizacao.coords.longitude).replace('.', ','));

            Alert.alert(
                'Localização capturada',
                'Latitude e longitude foram preenchidas automaticamente.'
            );
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização atual.');
        } finally {
            setBuscandoLocalizacao(false);
        }
    }

    async function salvarPosto() {
        Keyboard.dismiss();
        setErro('');

        if (!usuario?.id) {
            setErro('Usuário não identificado. Saia e entre novamente.');
            return;
        }

        if (!validarTextoObrigatorio(nome)) {
            setErro('Informe o nome do posto.');
            return;
        }

        if (!validarTextoObrigatorio(endereco)) {
            setErro('Informe o endereço do posto.');
            return;
        }

        if (!validarTextoObrigatorio(gasolina)) {
            setErro('Informe o preço da gasolina.');
            return;
        }

        if (!validarTextoObrigatorio(etanol)) {
            setErro('Informe o preço do etanol.');
            return;
        }

        if (!validarPreco(gasolina)) {
            setErro('Digite um preço válido para gasolina.');
            return;
        }

        if (!validarPreco(etanol)) {
            setErro('Digite um preço válido para etanol.');
            return;
        }

        if (diesel.trim() && !validarPreco(diesel)) {
            setErro('Digite um preço válido para diesel.');
            return;
        }

        try {
            setSalvando(true);

            await cadastrarPosto({
                donoId: usuario.id,
                nome,
                endereco,
                telefone,
                gasolina,
                etanol,
                diesel,
                latitude: latitude ? Number(latitude.replace(',', '.')) : null,
                longitude: longitude ? Number(longitude.replace(',', '.')) : null,
            });
            await enviarNotificacaoLocal({
                titulo: 'Posto enviado para análise',
                mensagem: 'Seu posto foi cadastrado e aguarda aprovação do administrador.',
            });
            Alert.alert(
                'Posto enviado',
                'Seu posto foi enviado para análise. Depois ele aparecerá no app quando for aprovado.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível cadastrar o posto.');
        } finally {
            setSalvando(false);
        }
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
                    title="Cadastrar Posto"
                    subtitle="Preencha os dados do seu posto para enviar para aprovação."
                />

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Dados do posto</Text>

                    <AppInput
                        label="Nome do posto"
                        placeholder="Ex: Posto Avenida"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                    />

                    <AppInput
                        label="Endereço"
                        placeholder="Ex: Av. Principal, 123"
                        value={endereco}
                        onChangeText={setEndereco}
                        autoCapitalize="sentences"
                    />

                    <AppInput
                        label="Telefone"
                        placeholder="Ex: (81) 99999-9999"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Localização no mapa</Text>

                    <AppButton
                        title="Usar localização atual"
                        onPress={pegarLocalizacaoAtual}
                        loading={buscandoLocalizacao}
                    />

                    <Text style={styles.helpText}>
                        Use este botão estando no local do posto para preencher latitude e longitude automaticamente.
                    </Text>

                    <View style={styles.divider} />

                    <AppInput
                        label="Latitude"
                        placeholder="Ex: -8,2335"
                        value={latitude}
                        onChangeText={setLatitude}
                        keyboardType="decimal-pad"
                    />

                    <AppInput
                        label="Longitude"
                        placeholder="Ex: -35,7962"
                        value={longitude}
                        onChangeText={setLongitude}
                        keyboardType="decimal-pad"
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Preços iniciais</Text>

                    <AppInput
                        label="Gasolina"
                        placeholder="Ex: 5,89"
                        value={gasolina}
                        onChangeText={(text) => setGasolina(formatarPrecoDigitado(text))}
                        keyboardType="decimal-pad"
                    />

                    <AppInput
                        label="Etanol"
                        placeholder="Ex: 4,29"
                        value={etanol}
                        onChangeText={(text) => setEtanol(formatarPrecoDigitado(text))}
                        keyboardType="decimal-pad"
                    />

                    <AppInput
                        label="Diesel"
                        placeholder="Ex: 5,99"
                        value={diesel}
                        onChangeText={(text) => setDiesel(formatarPrecoDigitado(text))}
                        keyboardType="decimal-pad"
                    />

                    {erro ? <Text style={styles.error}>{erro}</Text> : null}

                    <AppButton
                        title="Enviar para aprovação"
                        onPress={salvarPosto}
                        loading={salvando}
                    />

                    <AppButton
                        title="Cancelar"
                        variant="outline"
                        onPress={() => navigation.goBack()}
                    />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Importante</Text>
                    <Text style={styles.infoText}>
                        Por segurança, novos postos entram como pendentes até serem aprovados pelo administrador.
                    </Text>
                </View>
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

        sectionTitle: {
            fontSize: 18,
            fontWeight: '900',
            color: colors.text,
            marginBottom: 14,
        },

        helpText: {
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 19,
            marginTop: 8,
            marginBottom: 12,
        },

        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 12,
        },

        error: {
            color: colors.danger,
            fontSize: 14,
            fontWeight: '700',
            marginBottom: 10,
        },

        infoCard: {
            backgroundColor: colors.surfaceSoft,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },

        infoTitle: {
            fontSize: 16,
            fontWeight: '900',
            color: colors.primary,
            marginBottom: 6,
        },

        infoText: {
            fontSize: 14,
            color: colors.text,
            lineHeight: 20,
        },
    });
}