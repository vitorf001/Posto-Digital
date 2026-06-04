import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function AdminPostosScreen() {
  const [postos, setPostos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('pendentes');

  useEffect(() => {
    buscarPostos();
  }, [filtro]);

  async function buscarPostos() {
    setCarregando(true);
    const { data } = await supabase
      .from('postos')
      .select('*, combustiveis(*)')
      .eq('aprovado', filtro === 'aprovados')
      .order('criado_em', { ascending: false });

    setPostos(data || []);
    setCarregando(false);
  }

  async function aprovar(posto) {
    Alert.alert('Aprovar Posto', `Aprovar "${posto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprovar', onPress: async () => {
          await supabase.from('postos').update({ aprovado: true }).eq('id', posto.id);
          buscarPostos();
        }
      }
    ]);
  }

  async function reprovar(posto) {
    Alert.alert('Reprovar Posto', `Reprovar e excluir "${posto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reprovar', style: 'destructive', onPress: async () => {
          await supabase.from('postos').delete().eq('id', posto.id);
          buscarPostos();
        }
      }
    ]);
  }

  const renderPosto = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.endereco}>📍 {item.endereco}</Text>
      <Text style={styles.info}>📅 Cadastrado em: {new Date(item.criado_em).toLocaleDateString('pt-BR')}</Text>

      {item.combustiveis.length > 0 && (
        <View style={styles.precos}>
          {item.combustiveis.map(c => (
            <Text key={c.id} style={styles.preco}>{c.tipo}: R$ {Number(c.preco).toFixed(2)}</Text>
          ))}
        </View>
      )}

      {filtro === 'pendentes' && (
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.botaoAprovar} onPress={() => aprovar(item)}>
            <Text style={styles.botaoTexto}>✅ Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoReprovar} onPress={() => reprovar(item)}>
            <Text style={styles.botaoTexto}>❌ Reprovar</Text>
          </TouchableOpacity>
        </View>
      )}

      {filtro === 'aprovados' && (
        <TouchableOpacity style={styles.botaoReprovar} onPress={() => reprovar(item)}>
          <Text style={styles.botaoTexto}>❌ Remover</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBtn, filtro === 'pendentes' && styles.filtroAtivo]}
          onPress={() => setFiltro('pendentes')}
        >
          <Text style={[styles.filtroTexto, filtro === 'pendentes' && styles.filtroTextoAtivo]}>Pendentes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBtn, filtro === 'aprovados' && styles.filtroAtivo]}
          onPress={() => setFiltro('aprovados')}
        >
          <Text style={[styles.filtroTexto, filtro === 'aprovados' && styles.filtroTextoAtivo]}>Aprovados</Text>
        </TouchableOpacity>
      </View>

      {carregando
        ? <ActivityIndicator size="large" color="#f4a500" style={{ marginTop: 40 }} />
        : <FlatList
            data={postos}
            keyExtractor={item => item.id}
            renderItem={renderPosto}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum posto {filtro === 'pendentes' ? 'pendente' : 'aprovado'}.</Text>
            }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filtros: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, gap: 8 },
  filtroBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  filtroAtivo: { backgroundColor: '#f4a500', borderColor: '#f4a500' },
  filtroTexto: { color: '#666', fontWeight: 'bold' },
  filtroTextoAtivo: { color: '#fff' },
  lista: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  endereco: { fontSize: 13, color: '#666', marginBottom: 4 },
  info: { fontSize: 12, color: '#999', marginBottom: 8 },
  precos: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  preco: { fontSize: 12, backgroundColor: '#fff8ec', color: '#f4a500', padding: 4, borderRadius: 6 },
  botoes: { flexDirection: 'row', gap: 8 },
  botaoAprovar: { flex: 1, backgroundColor: '#27ae60', padding: 10, borderRadius: 8, alignItems: 'center' },
  botaoReprovar: { flex: 1, backgroundColor: '#e74c3c', padding: 10, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
});