import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function AdminUsuariosScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function buscarUsuarios() {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .order('criado_em', { ascending: false });
    setUsuarios(data || []);
    setCarregando(false);
  }

  async function alterarTipo(usuario, novoTipo) {
    Alert.alert(
      'Alterar Tipo',
      `Alterar "${usuario.nome || usuario.id}" para ${novoTipo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar', onPress: async () => {
            await supabase.from('usuarios').update({ tipo: novoTipo }).eq('id', usuario.id);
            buscarUsuarios();
          }
        }
      ]
    );
  }

  async function excluir(usuario) {
    Alert.alert(
      'Excluir Usuário',
      `Excluir "${usuario.nome || usuario.id}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive', onPress: async () => {
            await supabase.from('usuarios').delete().eq('id', usuario.id);
            buscarUsuarios();
          }
        }
      ]
    );
  }

  function corTipo(tipo) {
    if (tipo === 'admin') return '#9b59b6';
    if (tipo === 'dono') return '#f4a500';
    return '#3498db';
  }

  const renderUsuario = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.nome}>{item.nome || 'Sem nome'}</Text>
        <View style={[styles.tipoBadge, { backgroundColor: corTipo(item.tipo) }]}>
          <Text style={styles.tipoTexto}>{item.tipo || 'motorista'}</Text>
        </View>
      </View>

      <Text style={styles.info}>🆔 {item.id}</Text>
      <Text style={styles.info}>📅 {new Date(item.criado_em).toLocaleDateString('pt-BR')}</Text>

      <View style={styles.botoes}>
        {item.tipo !== 'admin' && (
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: '#9b59b6' }]}
            onPress={() => alterarTipo(item, 'admin')}
          >
            <Text style={styles.botaoTexto}>👑 Admin</Text>
          </TouchableOpacity>
        )}
        {item.tipo !== 'dono' && (
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: '#f4a500' }]}
            onPress={() => alterarTipo(item, 'dono')}
          >
            <Text style={styles.botaoTexto}>🏪 Dono</Text>
          </TouchableOpacity>
        )}
        {item.tipo !== 'motorista' && (
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: '#3498db' }]}
            onPress={() => alterarTipo(item, 'motorista')}
          >
            <Text style={styles.botaoTexto}>🚗 Motorista</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: '#e74c3c' }]}
          onPress={() => excluir(item)}
        >
          <Text style={styles.botaoTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {carregando
        ? <ActivityIndicator size="large" color="#f4a500" style={{ marginTop: 40 }} />
        : <FlatList
            data={usuarios}
            keyExtractor={item => item.id}
            renderItem={renderUsuario}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum usuário cadastrado.</Text>
            }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  lista: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  tipoBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tipoTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  info: { fontSize: 12, color: '#999', marginBottom: 4 },
  botoes: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  botao: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
});
