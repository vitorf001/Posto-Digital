import { supabase } from './supabase';

export async function listarUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function atualizarTipoUsuario(id, tipoUsuario) {
  const { error } = await supabase
    .from('usuarios')
    .update({
      tipo_usuario: tipoUsuario,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}