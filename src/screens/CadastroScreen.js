import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../services/supabase';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  async function cadastrar() {
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos!');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setCarregando(true);
    setErro(null);

    const { data, error } = await supabase.auth.signUp({ email, password: senha });

    if (error) {
      setErro('Erro ao criar conta. Tente outro e-mail.');
      setCarregando(false);
      return;
    }

    if (data.user) {
      await supabase.from('usuarios').insert({
        id: data.user.id,
        nome,
        tipo: 'dono',
      });
    }

    setSucesso(true);
    setCarregando(false);
  }

  if (sucesso) return (
    <View style={styles.sucesso}>
      <Text style={styles.sucessoIcon}>✅</Text>
      <Text style={styles.sucessoTitulo}>Conta criada!</Text>
      <Text style={styles.sucessoTexto}>Verifique seu e-mail para confirmar o cadastro.</Text>
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.botaoTexto}>Ir para o Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>⛽</Text>
          <Text style={styles.titulo}>Cadastre seu posto</Text>
          <Text style={styles.subtitulo}>Crie sua conta para gerenciar os preços</Text>
        </View>

        <View style={styles.form}>
          {erro && <Text style={styles.erro}>{erro}</Text>}

          <Text style={styles.label}>Seu nome</Text>
          <TextInput
            style={styles.input}
            placeholder="João Silva"
            value={nome}
            onChangeText={setNome}
          />

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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.botao} onPress={cadastrar} disabled={carregando}>
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botaoTexto}>Criar conta</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkLogin}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  logo: { fontSize: 50, marginBottom: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 14, color: '#999', marginTop: 4 },
  form: { paddingHorizontal: 24 },
  erro: { backgroundColor: '#ffe5e5', color: '#c0392b', padding: 12, borderRadius: 8, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#fafafa' },
  botao: { backgroundColor: '#f4a500', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkLogin: { textAlign: 'center', color: '#f4a500', marginTop: 20, fontSize: 14 },
  sucesso: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  sucessoIcon: { fontSize: 60, marginBottom: 16 },
  sucessoTitulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  sucessoTexto: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32 },
});