import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { useAuth } from '../../hooks/useAuth';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';

export function CadastroScreen({ navigation }) {
  const { cadastro, loading } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

async function handleCadastro() {
  setErro('');

  if (!nome || !email || !senha || !confirmarSenha) {
    setErro('Preencha todos os campos.');
    return;
  }

  if (senha.length < 6) {
    setErro('A senha precisa ter pelo menos 6 caracteres.');
    return;
  }

  if (senha !== confirmarSenha) {
    setErro('As senhas não conferem.');
    return;
  }

  const resultado = await cadastro(nome, email, senha);

  if (!resultado.sucesso) {
    setErro(resultado.mensagem);
  }
}
  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={globalStyles.title}>Criar conta</Text>
        <Text style={globalStyles.subtitle}>
          Cadastre-se para usar o Posto Digital.
        </Text>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        <AppInput
          label="Nome"
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <AppInput
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AppInput
          label="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <AppInput
          label="Confirmar senha"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <AppButton
          title="Cadastrar"
          onPress={handleCadastro}
          loading={loading}
        />

        <AppButton
          title="Já tenho conta"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },

  error: {
    color: colors.danger,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
});