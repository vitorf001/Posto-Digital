import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabase';

export default function NotificacoesScreen({ session }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  async function buscarNotificacoes() {
    const { data } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('usuario_id', session.user.id)
      .order('criado_em', { ascending: false });
    setNotificacoes(data || []);
    setCarregando(false);
  }

  async function marcarLida(id) {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    buscarNotificacoes();
  }

  async function marcarTodasLidas() {
    await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('usuario_id', session.user.id);
    buscarNotificacoes();
  }

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const renderNotificacao = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.lida && styles.cardNaoLida]}
      onPress={() => marcarLida(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        {!item.lida && <View style={styles.bolinha} />}
      </View>
      <Text style={styles.mensagem}>{item.mensagem}</Text>
      <Text style={styles.data}>{new Date(item.criado_em).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })}</Text>
    </TouchableOpacity>
  );

  if (carregando) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>🔔 Notificações</Text>
        {naoLidas > 0 && (
          <TouchableOpacity onPress={marcarTodasLidas}>
            <Text style={styles.marcarTodas}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notificacoes}
        keyExtractor={item => item.id}
        renderItem={renderNotificacao}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma notificação ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  marcarTodas: { fontSize: 13, color: '#f4a500' },
  lista: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, elevation: 2 },
  cardNaoLida: { borderLeftWidth: 4, borderLeftColor: '#f4a500' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titulo: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1 },
  bolinha: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f4a500' },
  mensagem: { fontSize: 13, color: '#666', marginBottom: 6 },
  data: { fontSize: 11, color: '#999' },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
});