import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '../../components/AppHeader';
import { LoadingScreen } from '../../components/LoadingScreen';
import {
  atualizarTipoUsuario,
  listarUsuarios,
} from '../../services/usuariosService';
import { useGlobalStyles } from '../../hooks/useGlobalStyles';
import { useTheme } from '../../hooks/useTheme';

const tiposUsuario = [
  { label: 'Usuário', value: 'usuario' },
  { label: 'Dono de Posto', value: 'dono_posto' },
  { label: 'Admin', value: 'admin' },
];

export function AdminUsuariosScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);

  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  async function carregarUsuarios() {
    try {
      setLoading(true);

      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
      console.log('Erro ao carregar usuários:', error.message);
    } finally {
      setLoading(false);
    }
  }

  function confirmarAlteracao(usuario, novoTipo) {
    if (usuario.tipo_usuario === novoTipo) return;

    Alert.alert(
      'Alterar tipo de usuário',
      `Deseja alterar ${usuario.nome} para "${novoTipo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Alterar', onPress: () => alterarTipo(usuario.id, novoTipo) },
      ]
    );
  }

  async function alterarTipo(id, novoTipo) {
    try {
      setProcessandoId(id);

      await atualizarTipoUsuario(id, novoTipo);
      await carregarUsuarios();

      Alert.alert('Sucesso', 'Tipo de usuário atualizado.');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o usuário.');
    } finally {
      setProcessandoId(null);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  if (loading) {
    return <LoadingScreen message="Carregando usuários..." />;
  }

  return (
    <View style={globalStyles.container}>
      <AppHeader
        title="Usuários"
        subtitle="Visualize usuários e altere permissões."
      />

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={carregarUsuarios}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhum usuário encontrado</Text>
            <Text style={styles.emptyText}>
              Quando usuários se cadastrarem, eles aparecerão aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topArea}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={24} color={colors.primary} />
              </View>

              <View style={styles.content}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.tipo}>Tipo atual: {item.tipo_usuario}</Text>
              </View>
            </View>

            <Text style={styles.label}>Alterar permissão</Text>

            <View style={styles.tipoContainer}>
              {tiposUsuario.map((tipo) => {
                const ativo = item.tipo_usuario === tipo.value;
                const processando = processandoId === item.id;

                return (
                  <TouchableOpacity
                    key={tipo.value}
                    style={[
                      styles.tipoButton,
                      ativo && styles.tipoButtonAtivo,
                      processando && styles.tipoButtonDisabled,
                    ]}
                    disabled={processando}
                    activeOpacity={0.85}
                    onPress={() => confirmarAlteracao(item, tipo.value)}
                  >
                    <Text
                      style={[
                        styles.tipoButtonText,
                        ativo && styles.tipoButtonTextAtivo,
                      ]}
                    >
                      {tipo.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      />
    </View>
  );
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

    topArea: {
      flexDirection: 'row',
      marginBottom: 14,
    },

    avatar: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: colors.surfaceSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    content: {
      flex: 1,
    },

    nome: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },

    email: {
      marginTop: 4,
      fontSize: 14,
      color: colors.textSecondary,
    },

    tipo: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: '800',
      color: colors.primary,
    },

    label: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
    },

    tipoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    tipoButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.background,
    },

    tipoButtonAtivo: {
      backgroundColor: colors.surfaceSoft,
      borderColor: colors.primary,
    },

    tipoButtonDisabled: {
      opacity: 0.6,
    },

    tipoButtonText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.textSecondary,
    },

    tipoButtonTextAtivo: {
      color: colors.primary,
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