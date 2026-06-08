import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '../services/supabase';
import {
  loginComEmail,
  cadastrarComEmail,
  sairDaConta,
  buscarSessaoAtual,
} from '../services/authService';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  async function carregarSessaoInicial() {
    try {
      const sessaoAtual = await buscarSessaoAtual();

      setSession(sessaoAtual);
      setUsuario(sessaoAtual?.user || null);

      if (sessaoAtual?.user) {
        await carregarPerfilUsuario(sessaoAtual.user.id);
      }
    } catch (error) {
      console.log('Erro ao carregar sessão:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function carregarPerfilUsuario(userId) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Erro ao buscar perfil:', error.message);
        setPerfil(null);
        setTipoUsuario('usuario');
        return;
      }

      setPerfil(data);
      setTipoUsuario(data?.tipo_usuario || 'usuario');
    } catch (error) {
      console.log('Erro inesperado ao buscar perfil:', error.message);
      setPerfil(null);
      setTipoUsuario('usuario');
    }
  }

  async function criarPerfilUsuario({ id, nome, email }) {
    const { error } = await supabase.from('usuarios').insert([
      {
        id,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        tipo_usuario: 'usuario',
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }
  }

  async function login(email, senha) {
    try {
      setLoading(true);

      const data = await loginComEmail(email, senha);

      setSession(data.session);
      setUsuario(data.user);

      if (data.user) {
        await carregarPerfilUsuario(data.user.id);
      }

      return {
        sucesso: true,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: traduzirErroAuth(error.message),
      };
    } finally {
      setLoading(false);
    }
  }

  async function cadastro(nome, email, senha) {
    try {
      setLoading(true);

      const data = await cadastrarComEmail({
        nome,
        email,
        senha,
      });

      if (data.user) {
        await criarPerfilUsuario({
          id: data.user.id,
          nome,
          email,
        });

        await carregarPerfilUsuario(data.user.id);
      }

      setSession(data.session);
      setUsuario(data.user);

      return {
        sucesso: true,
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: traduzirErroAuth(error.message),
      };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);

      await sairDaConta();

      setSession(null);
      setUsuario(null);
      setPerfil(null);
      setTipoUsuario(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    } finally {
      setLoading(false);
    }
  }

  function traduzirErroAuth(mensagem) {
    if (!mensagem) {
      return 'Ocorreu um erro inesperado.';
    }

    if (mensagem.includes('Invalid login credentials')) {
      return 'E-mail ou senha inválidos.';
    }

    if (mensagem.includes('Email not confirmed')) {
      return 'Confirme seu e-mail antes de entrar.';
    }

    if (mensagem.includes('User already registered')) {
      return 'Este e-mail já está cadastrado.';
    }

    if (mensagem.includes('Password should be')) {
      return 'A senha precisa ter pelo menos 6 caracteres.';
    }

    if (mensagem.includes('duplicate key')) {
      return 'Este usuário já possui cadastro.';
    }

    return mensagem;
  }

  useEffect(() => {
    carregarSessaoInicial();

    const { data } = supabase.auth.onAuthStateChange(async (_event, novaSessao) => {
      setSession(novaSessao);
      setUsuario(novaSessao?.user || null);

      if (novaSessao?.user) {
        await carregarPerfilUsuario(novaSessao.user.id);
      } else {
        setPerfil(null);
        setTipoUsuario(null);
      }

      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        usuario,
        perfil,
        tipoUsuario,
        loading,
        login,
        cadastro,
        logout,
        estaLogado: !!session,
        isAdmin: tipoUsuario === 'admin',
        isDonoPosto: tipoUsuario === 'dono_posto',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}