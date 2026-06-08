import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { LoadingScreen } from '../../components/LoadingScreen';
import { enviarNotificacaoLocal } from '../../services/notificacoesAppService';
import {
    aprovarPosto,
    listarTodosPostos,
    rejeitarPosto,
} from '../../services/postosService';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

export function AdminPostosScreen() {
    const [postos, setPostos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processandoId, setProcessandoId] = useState(null);

    const globalStyles = useGlobalStyles();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    async function carregarPostos() {
        try {
            setLoading(true);

            const data = await listarTodosPostos();
            setPostos(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os postos.');
            console.log('Erro ao carregar postos admin:', error.message);
        } finally {
            setLoading(false);
        }
    }

    async function confirmarAprovacao(posto) {
        Alert.alert(
            'Aprovar posto',
            `Deseja aprovar o posto "${posto.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Aprovar', onPress: () => handleAprovarPosto(posto.id) },
            ]
        );
    }

    async function confirmarRejeicao(posto) {
        Alert.alert(
            'Rejeitar posto',
            `Deseja rejeitar o posto "${posto.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Rejeitar',
                    style: 'destructive',
                    onPress: () => handleRejeitarPosto(posto.id),
                },
            ]
        );
    }

    async function handleAprovarPosto(id) {
        try {
            setProcessandoId(id);

            await aprovarPosto(id);
            await carregarPostos();
            await enviarNotificacaoLocal({
                titulo: 'Posto aprovado',
                mensagem: 'O posto foi aprovado e já pode aparecer no app.',
            });

            Alert.alert('Sucesso', 'Posto aprovado com sucesso.');
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível aprovar o posto.');
        } finally {
            setProcessandoId(null);
        }
    }

    async function handleRejeitarPosto(id) {
        try {
            setProcessandoId(id);

            await rejeitarPosto(id);
            await carregarPostos();
            await enviarNotificacaoLocal({
                titulo: 'Posto rejeitado',
                mensagem: 'O posto foi rejeitado pelo administrador.',
            });

            Alert.alert('Sucesso', 'Posto rejeitado com sucesso.');
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível rejeitar o posto.');
        } finally {
            setProcessandoId(null);
        }
    }

    useEffect(() => {
        carregarPostos();
    }, []);

    if (loading) {
        return <LoadingScreen message="Carregando postos..." />;
    }

    return (
        <View style={globalStyles.container}>
            <AppHeader
                title="Gerenciar Postos"
                subtitle="Aprove ou revise postos cadastrados."
            />

            <FlatList
                data={postos}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={carregarPostos}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>Nenhum posto encontrado</Text>
                        <Text style={styles.emptyText}>
                            Quando usuários cadastrarem postos, eles aparecerão aqui.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <View style={styles.info}>
                                <Text style={styles.nome}>{item.nome}</Text>
                                <Text style={styles.endereco}>{item.endereco}</Text>

                                {item.telefone ? (
                                    <Text style={styles.telefone}>Telefone: {item.telefone}</Text>
                                ) : null}
                            </View>

                            <View style={[styles.badge, getBadgeStyle(item.status, styles)]}>
                                <Text style={[styles.badgeText, getBadgeTextStyle(item.status, styles)]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.precos}>
                            <Text style={styles.preco}>
                                Gasolina: {item.gasolina ? `R$ ${item.gasolina}` : '-'}
                            </Text>
                            <Text style={styles.preco}>
                                Etanol: {item.etanol ? `R$ ${item.etanol}` : '-'}
                            </Text>
                            <Text style={styles.preco}>
                                Diesel: {item.diesel ? `R$ ${item.diesel}` : '-'}
                            </Text>
                        </View>

                        <View style={styles.localizacao}>
                            <Text style={styles.localizacaoText}>
                                Lat: {item.latitude || '-'} | Long: {item.longitude || '-'}
                            </Text>
                        </View>

                        {item.status === 'pendente' ? (
                            <View style={styles.actions}>
                                <AppButton
                                    title="Aprovar"
                                    onPress={() => confirmarAprovacao(item)}
                                    loading={processandoId === item.id}
                                />

                                <AppButton
                                    title="Rejeitar"
                                    variant="outline"
                                    onPress={() => confirmarRejeicao(item)}
                                    disabled={processandoId === item.id}
                                />
                            </View>
                        ) : null}
                    </View>
                )}
            />
        </View>
    );
}

function getBadgeStyle(status, styles) {
    if (status === 'aprovado') return styles.badgeSuccess;
    if (status === 'rejeitado') return styles.badgeDanger;
    return styles.badgeWarning;
}

function getBadgeTextStyle(status, styles) {
    if (status === 'aprovado') return styles.badgeTextSuccess;
    if (status === 'rejeitado') return styles.badgeTextDanger;
    return styles.badgeTextWarning;
}

function createStyles(colors) {
    return StyleSheet.create({
        card: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 14,
        },

        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
        },

        info: {
            flex: 1,
        },

        nome: {
            fontSize: 17,
            fontWeight: '900',
            color: colors.text,
        },

        endereco: {
            marginTop: 4,
            fontSize: 14,
            color: colors.textSecondary,
        },

        telefone: {
            marginTop: 4,
            fontSize: 13,
            color: colors.textSecondary,
        },

        badge: {
            alignSelf: 'flex-start',
            borderRadius: 999,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderWidth: 1,
        },

        badgeSuccess: {
            backgroundColor: colors.surfaceSoft,
            borderColor: colors.success,
        },

        badgeWarning: {
            backgroundColor: colors.mode === 'dark' ? '#451A03' : '#FEF3C7',
            borderColor: colors.warning,
        },

        badgeDanger: {
            backgroundColor: colors.mode === 'dark' ? '#450A0A' : '#FEE2E2',
            borderColor: colors.danger,
        },

        badgeText: {
            fontSize: 12,
            fontWeight: '900',
            textTransform: 'uppercase',
        },

        badgeTextSuccess: {
            color: colors.success,
        },

        badgeTextWarning: {
            color: colors.warning,
        },

        badgeTextDanger: {
            color: colors.danger,
        },

        precos: {
            marginTop: 14,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },

        preco: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '700',
            marginBottom: 4,
        },

        localizacao: {
            marginTop: 10,
        },

        localizacaoText: {
            fontSize: 12,
            color: colors.textSecondary,
        },

        actions: {
            marginTop: 14,
        },

        emptyCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },

        emptyTitle: {
            fontSize: 17,
            fontWeight: '900',
            color: colors.text,
            textAlign: 'center',
        },

        emptyText: {
            marginTop: 6,
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
        },
    });
}