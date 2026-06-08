import { supabase } from './supabase';

export async function listarNoticias() {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function criarNoticia({ titulo, descricao }) {
  const { data, error } = await supabase
    .from('noticias')
    .insert([
      {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function removerNoticia(id) {
  const { error } = await supabase
    .from('noticias')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}