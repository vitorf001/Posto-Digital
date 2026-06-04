import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabase';

const TIPOS_COMBUSTIVEL = ['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Gasolina Aditivada'];

export default function AtualizarPrecosScreen({ session }) {
  const [posto, setPosto] = useState(null);
  const [precos, setPrecos] = useState({});
  const [precosCartao, setPrecosCartao] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    const { data: postoData } = await supabase
      .from('postos')
      .select('*, combustiveis(*)')
      .eq('dono_id', session.user.id)
      .single();

    if (postoData) {
      setPosto(postoData);
      const precosAtuais = {};
      const precosCartaoAtuais = {};
      postoData.combustiveis.forEach(c => {
        precosAtuais[c.tipo] = String(c.preco);
        precosCartaoAtuais[c.tipo] = c.preco_cartao ? String(c.preco_cartao) : '';
      });
      setPrecos(precosAtuais);
      setPrecosCartao(precosCartaoAtuais);
    }
    setCarregando(false);
  }

  async function salvarPrecos() {
  if (!posto) {
    Alert.alert('Atenção', 'Você precisa cadastrar seu posto primeiro!');
    return;
  }
  if (!posto.aprovado) {
    Alert.alert('Atenção', 'Seu posto ainda não foi aprovado pelo administrador.');
    return;
  }

  setSalvando(true);

  for (const tipo of TIPOS_COMBUSTIVEL) {
    const preco = precos[tipo];
    if (!preco) continue;

    const precoNum = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNum)) continue;

    const precoCartaoNum = precosCartao[tipo]
      ? parseFloat(precosCartao[tipo].replace(',', '.'))
      : null;

    const existente = posto.combustiveis.find(c => c.tipo === tipo);

    if (existente) {
      await supabase
        .from('combustiveis')
        .update({
          preco: precoNum,
          preco_cartao: precoCartaoNum,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', existente.id);
    } else {
      await supabase
        .from('combustiveis')
        .insert({ posto_id: posto.id, tipo, preco: precoNum, preco_cartao: precoCartaoNum });
    }
  }

  Alert.alert('✅ Sucesso', 'Preços atualizados com sucesso!');
  setSalvando(false);
  buscarDados();
}

  if (carregando) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
    </View>
  );

  if (!posto) return (
    <View style={styles.centro}>
      <Text style={styles.semPosto}>Você ainda não tem um posto cadastrado.</Text>
      <Text style={styles.semPostoDica}>Vá em "Meu Posto" para cadastrar!</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>⛽ Atualizar Preços</Text>
      <Text style={styles.nomePosto}>{posto.nome}</Text>

      {!posto.aprovado && (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>⏳ Posto aguardando aprovação.</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.dica}>💡 Deixe em branco os combustíveis que seu posto não vende.</Text>

        <View style={styles.tabelaHeader}>
          <Text style={[styles.tabelaHeaderTexto, { flex: 2 }]}>Combustível</Text>
          <Text style={styles.tabelaHeaderTexto}>À Vista</Text>
          <Text style={styles.tabelaHeaderTexto}>Cartão</Text>
        </View>

        {TIPOS_COMBUSTIVEL.map(tipo => (
          <View key={tipo} style={styles.row}>
            <Text style={styles.rowTipo}>{tipo}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.cifrao}>R$</Text>
              <TextInput
                style={styles.precoInput}
                value={precos[tipo] || ''}
                onChangeText={val => setPrecos(prev => ({ ...prev, [tipo]: val }))}
                placeholder="0,00"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.cifrao}>R$</Text>
              <TextInput
                style={styles.precoInput}
                value={precosCartao[tipo] || ''}
                onChangeText={val => setPrecosCartao(prev => ({ ...prev, [tipo]: val }))}
                placeholder="0,00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.botao} onPress={salvarPrecos} disabled={salvando}>
        {salvando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Salvar Preços</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  semPosto: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 8 },
  semPostoDica: { fontSize: 14, color: '#999', textAlign: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  nomePosto: { fontSize: 14, color: '#f4a500', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' },
  aviso: { backgroundColor: '#fff8ec', margin: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#f4a500' },
  avisoTexto: { color: '#e67e22', textAlign: 'center' },
  card: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 16, elevation: 2 },
  dica: { fontSize: 12, color: '#999', marginBottom: 12 },
  tabelaHeader: { flexDirection: 'row', backgroundColor: '#f4a500', padding: 8, borderRadius: 8, marginBottom: 4 },
  tabelaHeaderTexto: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowTipo: { flex: 2, fontSize: 13, color: '#333' },
  inputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 4, marginHorizontal: 2, backgroundColor: '#fafafa' },
  cifrao: { fontSize: 11, color: '#999' },
  precoInput: { fontSize: 13, padding: 6, flex: 1, textAlign: 'right' },
  botao: { backgroundColor: '#f4a500', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});