import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function CalculadoraScreen({ route }) {
  const precoGasolinaParam = route?.params?.precoGasolina || '';
  const precoEtanolParam = route?.params?.precoEtanol || '';
  const [precoGasolina, setPrecoGasolina] = useState(precoGasolinaParam);
  const [precoEtanol, setPrecoEtanol] = useState(precoEtanolParam);
  const [consumoGasolina, setConsumoGasolina] = useState('');
  const [resultado, setResultado] = useState(null);

  function calcular() {
    const g = parseFloat(precoGasolina.replace(',', '.'));
    const e = parseFloat(precoEtanol.replace(',', '.'));
    const c = parseFloat(consumoGasolina.replace(',', '.'));

    if (!g || !e || !c) {
      setResultado({ erro: 'Preencha todos os campos!' });
      return;
    }

    // Regra dos 70%: vale etanol se preço etanol / preço gasolina < 0.7
    const relacao = e / g;
    const consumoEtanol = c * 0.7; // etanol tem ~70% da eficiência da gasolina

    const custoPorKmGasolina = g / c;
    const custoPorKmEtanol = e / consumoEtanol;

    const melhor = relacao < 0.7 ? 'etanol' : 'gasolina';
    const economia = Math.abs(custoPorKmGasolina - custoPorKmEtanol).toFixed(3);

    setResultado({ melhor, relacao: (relacao * 100).toFixed(1), custoPorKmGasolina: custoPorKmGasolina.toFixed(3), custoPorKmEtanol: custoPorKmEtanol.toFixed(3), economia });
  }

  function limpar() {
    setPrecoGasolina('');
    setPrecoEtanol('');
    setConsumoGasolina('');
    setResultado(null);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🧮 Calculadora Econômica</Text>
      <Text style={styles.subtitulo}>Descubra qual combustível é mais vantajoso para o seu veículo</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Preço da Gasolina (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 6.49"
          keyboardType="decimal-pad"
          value={precoGasolina}
          onChangeText={setPrecoGasolina}
        />

        <Text style={styles.label}>Preço do Etanol (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 4.99"
          keyboardType="decimal-pad"
          value={precoEtanol}
          onChangeText={setPrecoEtanol}
        />

        <Text style={styles.label}>Consumo do seu carro com Gasolina (km/l)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 12"
          keyboardType="decimal-pad"
          value={consumoGasolina}
          onChangeText={setConsumoGasolina}
        />

        <TouchableOpacity style={styles.botao} onPress={calcular}>
          <Text style={styles.botaoTexto}>Calcular</Text>
        </TouchableOpacity>
      </View>

      {resultado?.erro && (
        <View style={styles.cardErro}>
          <Text style={styles.erroTexto}>{resultado.erro}</Text>
        </View>
      )}

      {resultado && !resultado.erro && (
        <View style={styles.cardResultado}>
          <Text style={styles.resultadoTitulo}>
            {resultado.melhor === 'etanol' ? '🟢 Use Etanol!' : '🟡 Use Gasolina!'}
          </Text>
          <Text style={styles.resultadoSubtitulo}>
            {resultado.melhor === 'etanol'
              ? 'O etanol está mais vantajoso para seu veículo'
              : 'A gasolina está mais vantajosa para seu veículo'}
          </Text>

          <View style={styles.separador} />

          <View style={styles.detalheRow}>
            <Text style={styles.detalheLabel}>Relação Etanol/Gasolina</Text>
            <Text style={[styles.detalheValor, { color: resultado.relacao < 70 ? '#27ae60' : '#e67e22' }]}>
              {resultado.relacao}%
            </Text>
          </View>
          <Text style={styles.dica}>
            {resultado.relacao < 70
              ? '✅ Abaixo de 70% — etanol vale a pena!'
              : '⚠️ Acima de 70% — gasolina é mais econômica'}
          </Text>

          <View style={styles.separador} />

          <View style={styles.detalheRow}>
            <Text style={styles.detalheLabel}>Custo por km (Gasolina)</Text>
            <Text style={styles.detalheValor}>R$ {resultado.custoPorKmGasolina}</Text>
          </View>
          <View style={styles.detalheRow}>
            <Text style={styles.detalheLabel}>Custo por km (Etanol)</Text>
            <Text style={styles.detalheValor}>R$ {resultado.custoPorKmEtanol}</Text>
          </View>
          <View style={styles.detalheRow}>
            <Text style={styles.detalheLabel}>Economia por km</Text>
            <Text style={[styles.detalheValor, { color: '#27ae60' }]}>R$ {resultado.economia}</Text>
          </View>

          <TouchableOpacity style={styles.botaoLimpar} onPress={limpar}>
            <Text style={styles.botaoLimparTexto}>Calcular novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#333', padding: 20, paddingBottom: 4 },
  subtitulo: { fontSize: 13, color: '#666', paddingHorizontal: 20, paddingBottom: 16 },
  card: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 16, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  botao: { backgroundColor: '#f4a500', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 20 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardErro: { backgroundColor: '#ffe5e5', margin: 12, borderRadius: 12, padding: 16 },
  erroTexto: { color: '#c0392b', textAlign: 'center' },
  cardResultado: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 16, elevation: 2 },
  resultadoTitulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  resultadoSubtitulo: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 12 },
  separador: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  detalheRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detalheLabel: { fontSize: 14, color: '#555' },
  detalheValor: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  dica: { fontSize: 12, color: '#666', marginBottom: 8 },
  botaoLimpar: { borderWidth: 1, borderColor: '#f4a500', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  botaoLimparTexto: { color: '#f4a500', fontSize: 15, fontWeight: 'bold' },
});