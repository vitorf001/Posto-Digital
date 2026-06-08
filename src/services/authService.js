import { supabase } from './supabase';

export async function loginComEmail(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function cadastrarComEmail({ nome, email, senha }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: senha,
    options: {
      data: {
        nome: nome.trim(),
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function sairDaConta() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function buscarSessaoAtual() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}