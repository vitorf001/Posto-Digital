import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { supabase } from '../services/supabase';

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarNoticias() {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('ativo', true)
        .order('publicado_em', { ascending: false });

      if (!error) setNoticias(data || []);
      setCarregando(false);
    }
    buscarNoticias();
  }, []);

  function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  if (carregando) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
      <Text style={styles.textoCarregando}>Buscando notícias...</Text>
    </View>
  );

  const renderNoticia = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => item.url && Linking.openURL(item.url)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.fonte}>{item.fonte || 'Posto Digital'}</Text>
        <Text style={styles.data}>{formatarData(item.publicado_em)}</Text>
      </View>
      <Text style={styles.titulo} numberOfLines={3}>{item.titulo}</Text>
      {item.descricao && (
        <Text style={styles.descricao} numberOfLines={3}>{item.descricao}</Text>
      )}
      {item.url && <Text style={styles.lerMais}>Ler matéria completa →</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.cabecalho}>📰 Notícias</Text>
      <FlatList
        data={noticias}
        keyExtractor={item => item.id}
        renderItem={renderNoticia}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma notícia publicada ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textoCarregando: { marginTop: 10, color: '#666' },
  cabecalho: { fontSize: 20, fontWeight: 'bold', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  lista: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  fonte: { fontSize: 12, color: '#f4a500', fontWeight: 'bold' },
  data: { fontSize: 12,  color: '#999' },
  titulo: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 6, lineHeight: 22 },
  descricao: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 8 },
  lerMais: { fontSize: 13, color: '#f4a500', fontWeight: 'bold' },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 }
});