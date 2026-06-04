import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function MeuPostoScreen({ session }) {
  const [posto, setPosto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [diferenciais, setDiferenciais] = useState({
    wifi: false,
    banheiro: false,
    conveniencia: false,
    carregador_eletrico: false,
    troca_oleo: false,
    restaurante: false,
    caixa_eletronico: false,
    lavagem: false,
  });

  useEffect(() => {
    buscarPosto();
  }, []);

  async function buscarPosto() {
    const { data, error } = await supabase
      .from('postos')
      .select('*')
      .eq('dono_id', session.user.id)
      .single();

    if (data) {
      setPosto(data);
      setNome(data.nome);
      setEndereco(data.endereco);
      setTelefone(data.telefone || '');
      setLatitude(String(data.latitude));
      setLongitude(String(data.longitude));
      setDiferenciais({
        wifi: data.wifi,
        banheiro: data.banheiro,
        conveniencia: data.conveniencia,
        carregador_eletrico: data.carregador_eletrico,
        troca_oleo: data.troca_oleo,
        restaurante: data.restaurante,
        caixa_eletronico: data.caixa_eletronico,
        lavagem: data.lavagem,
      });
    }
    setCarregando(false);
  }

  function toggleDiferencial(chave) {
    setDiferenciais(prev => ({ ...prev, [chave]: !prev[chave] }));
  }

  async function salvar() {
    if (!nome || !endereco || !latitude || !longitude) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    setSalvando(true);

    const dados = {
      nome,
      endereco,
      telefone,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      dono_id: session.user.id,
      ...diferenciais,
    };

    if (posto) {
      await supabase.from('postos').update(dados).eq('id', posto.id);
      Alert.alert('✅ Sucesso', 'Posto atualizado com sucesso!');
    } else {
      await supabase.from('postos').insert({ ...dados, aprovado: false });
      Alert.alert('✅ Cadastrado!', 'Seu posto foi enviado para aprovação do administrador.');
    }

    setSalvando(false);
    buscarPosto();
  }

  if (carregando) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
    </View>
  );

  const listaDiferenciais = [
    { chave: 'wifi', label: '📶 Wi-Fi' },
    { chave: 'banheiro', label: '🚻 Banheiro' },
    { chave: 'conveniencia', label: '🛒 Conveniência' },
    { chave: 'carregador_eletrico', label: '⚡ Carregador Elétrico' },
    { chave: 'troca_oleo', label: '🔧 Troca de Óleo' },
    { chave: 'restaurante', label: '🍽️ Restaurante' },
    { chave: 'caixa_eletronico', label: '🏧 Caixa Eletrônico' },
    { chave: 'lavagem', label: '🚿 Lavagem' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{posto ? '✏️ Editar Posto' : '🏪 Cadastrar Posto'}</Text>

      {posto && !posto.aprovado && (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>⏳ Seu posto está aguardando aprovação do administrador.</Text>
        </View>
      )}

      {posto && posto.aprovado && (
        <View style={styles.aprovado}>
          <Text style={styles.aprovadoTexto}>✅ Posto aprovado e visível no app!</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Nome do Posto *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Posto São João" />

        <Text style={styles.label}>Endereço *</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Ex: Av. Principal, 100, Caruaru-PE" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="Ex: (81) 99999-9999" keyboardType="phone-pad" />

        <Text style={styles.label}>Latitude *</Text>
        <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="Ex: -8.2760" keyboardType="decimal-pad" />

        <Text style={styles.label}>Longitude *</Text>
        <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="Ex: -35.9753" keyboardType="decimal-pad" />

        <Text style={styles.dica}>💡 Para pegar as coordenadas, abra o Google Maps, toque e segure no local do seu posto e copie os números que aparecem.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.secaoTitulo}>Diferenciais do Posto</Text>
        <View style={styles.diferenciais}>
          {listaDiferenciais.map(d => (
            <TouchableOpacity
              key={d.chave}
              style={[styles.diferencialBtn, diferenciais[d.chave] && styles.diferencialAtivo]}
              onPress={() => toggleDiferencial(d.chave)}
            >
              <Text style={[styles.diferencialTexto, diferenciais[d.chave] && styles.diferencialTextoAtivo]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>{posto ? 'Salvar Alterações' : 'Cadastrar Posto'}</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  aviso: { backgroundColor: '#fff8ec', margin: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#f4a500' },
  avisoTexto: { color: '#e67e22', textAlign: 'center' },
  aprovado: { backgroundColor: '#eafaf1', margin: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#27ae60' },
  aprovadoTexto: { color: '#27ae60', textAlign: 'center' },
  card: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 16, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#fafafa' },
  dica: { fontSize: 12, color: '#999', marginTop: 12, lineHeight: 18 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  diferenciais: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  diferencialBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fafafa' },
  diferencialAtivo: { backgroundColor: '#fff8ec', borderColor: '#f4a500' },
  diferencialTexto: { fontSize: 13, color: '#666' },
  diferencialTextoAtivo: { color: '#f4a500', fontWeight: 'bold' },
  botao: { backgroundColor: '#f4a500', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});