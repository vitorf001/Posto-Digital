import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';

export default function DetalhesScreen({ route, navigation }) {
  const { posto } = route.params;

  function abrirRota() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${posto.latitude},${posto.longitude}&travelmode=driving`;
    Linking.openURL(url);
  }

  function abrirCalculadora() {
    const gasolina = posto.combustiveis.find(c => c.tipo === 'Gasolina');
    const etanol = posto.combustiveis.find(c => c.tipo === 'Etanol');
    navigation.navigate('Calculadora', {
      screen: 'CalculadoraHome',
      params: {
        precoGasolina: gasolina ? String(gasolina.preco) : '',
        precoEtanol: etanol ? String(etanol.preco) : '',
      }
    });
  }

  const diferenciais = [
    { chave: 'wifi', label: '📶 Wi-Fi' },
    { chave: 'banheiro', label: '🚻 Banheiro' },
    { chave: 'conveniencia', label: '🛒 Conveniência' },
    { chave: 'carregador_eletrico', label: '⚡ Carregador Elétrico' },
    { chave: 'troca_oleo', label: '🔧 Troca de Óleo' },
    { chave: 'restaurante', label: '🍽️ Restaurante' },
    { chave: 'caixa_eletronico', label: '🏧 Caixa Eletrônico' },
    { chave: 'lavagem', label: '🚿 Lavagem' },
  ].filter(d => posto[d.chave]);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.nome}>⛽ {posto.nome}</Text>
        <Text style={styles.endereco}>📍 {posto.endereco}</Text>
        {posto.distancia && (
          <Text style={styles.distancia}>{posto.distancia} km de distância</Text>
        )}
      </View>

     <View style={styles.secao}>
  <Text style={styles.secaoTitulo}>Combustíveis</Text>
  <View style={styles.tabela}>
    <View style={styles.tabelaHeader}>
      <Text style={styles.tabelaHeaderTexto}>Combustível</Text>
      <Text style={styles.tabelaHeaderTexto}>Preço</Text>
      <Text style={styles.tabelaHeaderTexto}>Atualizado</Text>
    </View>
    {posto.combustiveis.map(c => (
      <View key={c.id} style={styles.tabelaRow}>
        <Text style={styles.tabelaTipo}>{c.tipo}</Text>
        <Text style={styles.tabelaPreco}>R$ {Number(c.preco).toFixed(2)}</Text>
        <Text style={styles.tabelaData}>
          {new Date(c.atualizado_em).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    ))}
  </View>
</View>

      {diferenciais.length > 0 && (
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Diferenciais</Text>
          <View style={styles.diferenciais}>
            {diferenciais.map(d => (
              <View key={d.chave} style={styles.diferencialBadge}>
                <Text style={styles.diferencialTexto}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.botaoCalculadora} onPress={abrirCalculadora}>
        <Text style={styles.botaoCalculadoraTexto}>🧮 Calcular combustível mais econômico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoRota} onPress={abrirRota}>
        <Text style={styles.botaoRotaTexto}>🗺️ Traçar Rota</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 20, marginBottom: 12 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  endereco: { fontSize: 14, color: '#666', marginBottom: 4 },
  distancia: { fontSize: 14, color: '#f4a500', fontWeight: 'bold' },
  secao: { backgroundColor: '#fff', padding: 16, marginBottom: 12 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  combustivelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  combustivelTipo: { fontSize: 15, color: '#333' },
  combustivelPreco: { fontSize: 15, fontWeight: 'bold', color: '#f4a500' },
  diferenciais: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  diferencialBadge: { backgroundColor: '#fff8ec', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#f4a500' },
  diferencialTexto: { fontSize: 13, color: '#333' },
  botaoCalculadora: { backgroundColor: '#fff', margin: 12, marginBottom: 0, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f4a500' },
  botaoCalculadoraTexto: { color: '#f4a500', fontSize: 15, fontWeight: 'bold' },
  botaoRota: { backgroundColor: '#f4a500', margin: 12, padding: 16, borderRadius: 12, alignItems: 'center' },
  botaoRotaTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tabela: { borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden' },
  tabelaHeader: { flexDirection: 'row', backgroundColor: '#f4a500', padding: 8 },
  tabelaHeaderTexto: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  tabelaRow: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tabelaTipo: { flex: 1, fontSize: 13, color: '#333' },
  tabelaPreco: { flex: 1, fontSize: 13, color: '#f4a500', fontWeight: 'bold', textAlign: 'center' },
  tabelaData: { flex: 1, fontSize: 11, color: '#999', textAlign: 'right' },
});