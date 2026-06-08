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

export function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

 async function handleLogin() {
  setErro('');

  if (!email || !senha) {
    setErro('Preencha e-mail e senha.');
    return;
  }

  const resultado = await login(email, senha);

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
        <Text style={globalStyles.title}>Entrar</Text>
        <Text style={globalStyles.subtitle}>
          Acesse sua conta no Posto Digital.
        </Text>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

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

        <AppButton
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
        />

        <AppButton
          title="Criar conta"
          variant="outline"
          onPress={() => navigation.navigate('Cadastro')}
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