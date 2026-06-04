import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../services/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function entrar() {
  if (!email || !senha) {
    setErro('Preencha todos os campos!');
    return;
  }
  setCarregando(true);
  setErro(null);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  
  console.log('Resultado login:', JSON.stringify(data));
  console.log('Erro login:', JSON.stringify(error));

  if (error) {
    setErro(error.message);
  }
  setCarregando(false);
}

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>⛽</Text>
        <Text style={styles.titulo}>Posto Digital</Text>
        <Text style={styles.subtitulo}>Acesso para donos de posto</Text>
      </View>

      <View style={styles.form}>
        {erro && <Text style={styles.erro}>{erro}</Text>}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Entrar</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkCadastro}>Não tem conta? Cadastre seu posto aqui</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 40 },
  logo: { fontSize: 60, marginBottom: 10 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 14, color: '#999', marginTop: 4 },
  form: { paddingHorizontal: 24 },
  erro: { backgroundColor: '#ffe5e5', color: '#c0392b', padding: 12, borderRadius: 8, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#fafafa' },
  botao: { backgroundColor: '#f4a500', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkCadastro: { textAlign: 'center', color: '#f4a500', marginTop: 20, fontSize: 14 },
});