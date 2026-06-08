import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
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
import {
    criarNoticia,
    listarNoticias,
    removerNoticia,
} from '../../services/noticiasService';
import { formatDate } from '../../utils/formatDate';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';
import { enviarNotificacaoLocal } from '../../services/notificacoesAppService';

export function AdminNoticiasScreen() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState('');
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const globalStyles = useGlobalStyles();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    async function carregarNoticias() {
        try {
            setLoading(true);
            const data = await listarNoticias();
            setNoticias(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as notícias.');
        } finally {
            setLoading(false);
        }
    }

    async function publicarNoticia() {
        Keyboard.dismiss();
        setErro('');

        if (!titulo.trim() || !descricao.trim()) {
            setErro('Preencha título e descrição.');
            return;
        }

        try {
            setSalvando(true);

            await criarNoticia({ titulo, descricao });
            await enviarNotificacaoLocal({
                titulo: 'Notícia publicada',
                mensagem: 'A notícia foi publicada com sucesso no app.',
            });

            setTitulo('');
            setDescricao('');

            await carregarNoticias();

            Alert.alert('Notícia publicada', 'A notícia foi adicionada com sucesso.');
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível publicar a notícia.');
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarRemocao(id) {
        Alert.alert(
            'Remover notícia',
            'Tem certeza que deseja remover esta notícia?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => excluirNoticia(id),
                },
            ]
        );
    }

    async function excluirNoticia(id) {
        try {
            await removerNoticia(id);
            await carregarNoticias();
            await enviarNotificacaoLocal({
                titulo: 'Notícia removida',
                mensagem: 'A notícia foi removida com sucesso.',
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível remover a notícia.');
        }
    }

    useEffect(() => {
        carregarNoticias();
    }, []);

    if (loading) {
        return <LoadingScreen message="Carregando notícias..." />;
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
                    title="Notícias"
                    subtitle="Publique comunicados e novidades para os usuários."
                />

                <View style={styles.formCard}>
                    <AppInput
                        label="Título"
                        placeholder="Digite o título"
                        value={titulo}
                        onChangeText={setTitulo}
                        autoCapitalize="sentences"
                    />

                    <AppInput
                        label="Descrição"
                        placeholder="Digite a descrição"
                        value={descricao}
                        onChangeText={setDescricao}
                        autoCapitalize="sentences"
                    />

                    {erro ? <Text style={styles.error}>{erro}</Text> : null}

                    <AppButton
                        title="Publicar notícia"
                        onPress={publicarNoticia}
                        loading={salvando}
                    />
                </View>

                <Text style={styles.sectionTitle}>Notícias publicadas</Text>

                <FlatList
                    data={noticias}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={styles.newsCard}>
                            <Text style={styles.newsTitle}>{item.titulo}</Text>
                            <Text style={styles.newsDescription}>{item.descricao}</Text>
                            <Text style={styles.newsDate}>{formatDate(item.criado_em)}</Text>

                            <AppButton
                                title="Remover"
                                variant="outline"
                                onPress={() => confirmarRemocao(item.id)}
                            />
                        </View>
                    )}
                />
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

        formCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 22,
        },

        error: {
            color: colors.danger,
            fontSize: 14,
            fontWeight: '700',
            marginBottom: 10,
        },

        sectionTitle: {
            fontSize: 18,
            fontWeight: '900',
            color: colors.text,
            marginBottom: 12,
        },

        newsCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 14,
        },

        newsTitle: {
            fontSize: 16,
            fontWeight: '900',
            color: colors.text,
        },

        newsDescription: {
            marginTop: 6,
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            marginBottom: 8,
        },

        newsDate: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.primary,
            marginBottom: 12,
        },
    });
}