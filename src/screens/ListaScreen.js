import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../services/supabase';

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function ListaScreen({ navigation }) {
  const [postos, setPostos] = useState([]);
  const [localizacao, setLocalizacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const posicao = await Location.getCurrentPositionAsync({});
        setLocalizacao(posicao.coords);
      }

      const { data, error } = await supabase
        .from('postos')
        .select('*, combustiveis(*)')
        .eq('aprovado', true);

      if (!error && data) {
        setPostos(data);
      }
      setCarregando(false);
    }
    carregar();
  }, []);

  const postosOrdenados = postos.map(posto => ({
    ...posto,
    distancia: localizacao
      ? calcularDistancia(localizacao.latitude, localizacao.longitude, posto.latitude, posto.longitude)
      : null
  })).sort((a, b) => a.distancia - b.distancia);

  if (carregando) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
      <Text style={styles.textoCarregando}>Buscando postos...</Text>
    </View>
  );

const renderPosto = ({ item }) => {
    const combustiveis = ['Gasolina', 'Gasolina Aditivada', 'Etanol', 'Diesel', 'GNV'];
    const combustiveisPosto = combustiveis
      .map(tipo => ({ tipo, dados: item.combustiveis.find(c => c.tipo === tipo) }))
      .filter(c => c.dados);

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes', { posto: item })}>
        <View style={styles.cardHeader}>
          <Text style={styles.nomePosto}>⛽ {item.nome}</Text>
          {item.distancia && (
            <Text style={styles.distancia}>{item.distancia} km</Text>
          )}
        </View>

        <Text style={styles.endereco}>📍 {item.endereco}</Text>

        <View style={styles.tabela}>
  <View style={styles.tabelaHeader}>
    <Text style={[styles.tabelaHeaderTexto, { flex: 2 }]}>Combustível</Text>
    <Text style={styles.tabelaHeaderTexto}>À Vista</Text>
    <Text style={styles.tabelaHeaderTexto}>Cartão</Text>
  </View>
  {combustiveisPosto.map(({ tipo, dados }) => (
    <View key={tipo} style={styles.tabelaRow}>
      <Text style={[styles.tabelaTipo, { flex: 2 }]}>{tipo}</Text>
      <Text style={styles.tabelaPreco}>R$ {Number(dados.preco).toFixed(2)}</Text>
      <Text style={styles.tabelaCartao}>
        {dados.preco_cartao ? `R$ ${Number(dados.preco_cartao).toFixed(2)}` : '-'}
      </Text>
    </View>
  ))}
</View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Postos próximos</Text>
      <FlatList
        data={postosOrdenados}
        keyExtractor={item => item.id}
        renderItem={renderPosto}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum posto encontrado na sua região.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabela: { marginTop: 10, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden' },
  tabelaHeader: { flexDirection: 'row', backgroundColor: '#f4a500', padding: 8 },
  tabelaHeaderTexto: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  tabelaRow: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tabelaTipo: { flex: 1, fontSize: 12, color: '#333' },
  tabelaPreco: { flex: 1, fontSize: 12, color: '#f4a500', fontWeight: 'bold', textAlign: 'center' },
  tabelaData: { flex: 1, fontSize: 11, color: '#999', textAlign: 'right' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textoCarregando: { marginTop: 10, color: '#666' },
  titulo: { fontSize: 20, fontWeight: 'bold', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  lista: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  nomePosto: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  distancia: { fontSize: 13, color: '#f4a500', fontWeight: 'bold' },
  endereco: { fontSize: 13, color: '#666', marginBottom: 12 },
  precos: { flexDirection: 'row', gap: 8 },
  precoBadge: { backgroundColor: '#fff8ec', borderRadius: 8, padding: 8, alignItems: 'center', flex: 1, borderWidth: 1, borderColor: '#f4a500' },
  precoTipo: { fontSize: 11, color: '#666', marginBottom: 2 },
  precoValor: { fontSize: 15, fontWeight: 'bold', color: '#f4a500' },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
  tabelaCartao: { flex: 1, fontSize: 12, color: '#3498db', fontWeight: 'bold', textAlign: 'center' }
});