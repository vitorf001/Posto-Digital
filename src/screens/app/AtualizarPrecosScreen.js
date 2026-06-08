import React, { useEffect, useState } from 'react';
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

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { AppInput } from '../../components/AppInput';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useMeuPosto } from '../../hooks/useMeuPosto';
import { enviarNotificacaoLocal } from '../../services/notificacoesAppService';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';
import { atualizarPrecosPosto } from '../../services/postosService';
import { formatarPrecoDigitado } from '../../utils/formatCurrency';
import { validarPreco } from '../../utils/validators';

export function AtualizarPrecosScreen({ navigation, route }) {
    const postoParam = route.params?.posto;
    const { posto: postoHook, loading } = useMeuPosto();

    const globalStyles = useGlobalStyles();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const posto = postoParam || postoHook;

    const [gasolina, setGasolina] = useState('');
    const [etanol, setEtanol] = useState('');
    const [diesel, setDiesel] = useState('');
    const [erro, setErro] = useState('');
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (posto) {
            setGasolina(posto.gasolina || '');
            setEtanol(posto.etanol || '');
            setDiesel(posto.diesel || '');
        }
    }, [posto]);

    function validarCampoPreco(nome, valor, obrigatorio = false) {
        if (!valor.trim() && !obrigatorio) {
            return true;
        }

        if (!valor.trim() && obrigatorio) {
            setErro(`Informe o preço de ${nome}.`);
            return false;
        }

        if (!validarPreco(valor)) {
            setErro(`Digite um preço válido para ${nome}.`);
            return false;
        }

        return true;
    }

    async function salvarPrecos() {
        Keyboard.dismiss();
        setErro('');

        if (!posto?.id) {
            setErro('Posto não encontrado.');
            return;
        }

        const gasolinaValida = validarCampoPreco('gasolina', gasolina, true);
        const etanolValido = validarCampoPreco('etanol', etanol, true);
        const dieselValido = validarCampoPreco('diesel', diesel, false);

        if (!gasolinaValida || !etanolValido || !dieselValido) {
            return;
        }

        try {
            setSalvando(true);

            await atualizarPrecosPosto({
                postoId: posto.id,
                gasolina,
                etanol,
                diesel,
            });
            await enviarNotificacaoLocal({
                titulo: 'Preços atualizados',
                mensagem: `Os preços de ${posto.nome} foram atualizados com sucesso.`,
            });

            Alert.alert(
                'Preços atualizados',
                'Os preços foram salvos com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível atualizar os preços.');
        } finally {
            setSalvando(false);
        }
    }

    if (loading && !postoParam) {
        return <LoadingScreen message="Carregando posto..." />;
    }

    if (!posto) {
        return (
            <View style={globalStyles.container}>
                <AppHeader
                    title="Atualizar preços"
                    subtitle="Nenhum posto encontrado para atualizar."
                />

                <AppButton
                    title="Cadastrar posto"
                    onPress={() => navigation.navigate('CadastrarPosto')}
                />
            </View>
        );
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
                    title="Atualizar preços"
                    subtitle={`Informe os preços atuais de ${posto.nome}.`}
                />

                <View style={styles.card}>
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
                        title="Salvar preços"
                        onPress={salvarPrecos}
                        loading={salvando}
                    />

                    <AppButton
                        title="Cancelar"
                        variant="outline"
                        onPress={() => navigation.goBack()}
                    />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Dica</Text>
                    <Text style={styles.infoText}>
                        Ao atualizar os preços, eles serão exibidos para os usuários na lista de postos e no mapa.
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