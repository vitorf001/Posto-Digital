import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { supabase } from '../services/supabase';

export default function AdminNoticiasScreen() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [criando, setCriando] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [url, setUrl] = useState('');
  const [fonte, setFonte] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarNoticias();
  }, []);

  async function buscarNoticias() {
    const { data } = await supabase
      .from('noticias')
      .select('*')
      .order('publicado_em', { ascending: false });
    setNoticias(data || []);
    setCarregando(false);
  }

  async function salvarNoticia() {
    if (!titulo) {
      Alert.alert('Atenção', 'O título é obrigatório!');
      return;
    }
    setSalvando(true);
    await supabase.from('noticias').insert({ titulo, descricao, url, fonte, ativo: true });
    setTitulo('');
    setDescricao('');
    setUrl('');
    setFonte('');
    setCriando(false);
    setSalvando(false);
    buscarNoticias();
  }

  async function toggleAtivo(noticia) {
    await supabase.from('noticias').update({ ativo: !noticia.ativo }).eq('id', noticia.id);
    buscarNoticias();
  }

  async function excluir(noticia) {
    Alert.alert('Excluir', `Excluir "${noticia.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          await supabase.from('noticias').delete().eq('id', noticia.id);
          buscarNoticias();
        }
      }
    ]);
  }

  const renderNoticia = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.noticiaTitulo} numberOfLines={2}>{item.titulo}</Text>
      <Text style={styles.noticiaFonte}>{item.fonte || 'Sem fonte'} • {new Date(item.publicado_em).toLocaleDateString('pt-BR')}</Text>
      <View style={styles.botoes}>
        <TouchableOpacity
          style={[styles.botaoToggle, item.ativo ? styles.botaoDesativar : styles.botaoAtivar]}
          onPress={() => toggleAtivo(item)}
        >
          <Text style={styles.botaoTexto}>{item.ativo ? '⏸ Desativar' : '▶️ Ativar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluir(item)}>
          <Text style={styles.botaoTexto}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {criando ? (
        <ScrollView style={styles.form}>
          <Text style={styles.formTitulo}>Nova Notícia</Text>
          <Text style={styles.label}>Título *</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título da notícia" multiline />
          <Text style={styles.label}>Descrição</Text>
          <TextInput style={[styles.input, styles.inputMultiline]} value={descricao} onChangeText={setDescricao} placeholder="Resumo da notícia" multiline numberOfLines={4} />
          <Text style={styles.label}>URL da matéria</Text>
          <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://..." keyboardType="url" autoCapitalize="none" />
          <Text style={styles.label}>Fonte</Text>
          <TextInput style={styles.input} value={fonte} onChangeText={setFonte} placeholder="Ex: G1, CNN Brasil" />
          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarNoticia} disabled={salvando}>
            {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoSalvarTexto}>Publicar Notícia</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoCancelar} onPress={() => setCriando(false)}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <TouchableOpacity style={styles.botaoNova} onPress={() => setCriando(true)}>
            <Text style={styles.botaoNovaTexto}>+ Nova Notícia</Text>
          </TouchableOpacity>
          {carregando
            ? <ActivityIndicator size="large" color="#f4a500" style={{ marginTop: 40 }} />
            : <FlatList
                data={noticias}
                keyExtractor={item => item.id}
                renderItem={renderNoticia}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={<Text style={styles.vazio}>Nenhuma notícia cadastrada.</Text>}
              />
          }
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  botaoNova: { backgroundColor: '#f4a500', margin: 12, padding: 14, borderRadius: 10, alignItems: 'center' },
  botaoNovaTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  lista: { paddingHorizontal: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  noticiaTitulo: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  noticiaFonte: { fontSize: 12, color: '#999', marginBottom: 12 },
  botoes: { flexDirection: 'row', gap: 8 },
  botaoToggle: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center' },
  botaoAtivar: { backgroundColor: '#27ae60' },
  botaoDesativar: { backgroundColor: '#e67e22' },
  botaoExcluir: { flex: 1, backgroundColor: '#e74c3c', padding: 8, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  form: { padding: 16 },
  formTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#fff' },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  botaoSalvar: { backgroundColor: '#f4a500', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  botaoSalvarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  botaoCancelar: { padding: 16, alignItems: 'center', marginTop: 8 },
  botaoCancelarTexto: { color: '#e74c3c', fontSize: 15 },
  vazio: { textAlign: 'center', color: '#999', marginTop: 40 },
});