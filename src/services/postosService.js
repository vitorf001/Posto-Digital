import { supabase } from './supabase';
import { converterPrecoParaNumero } from '../utils/formatCurrency';

export async function listarPostosAprovados() {
  const { data, error } = await supabase
    .from('postos')
    .select(`
      *,
      combustiveis (*)
    `)
    .eq('status', 'aprovado')
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return normalizarPostos(data || []);
}

export async function listarTodosPostos() {
  const { data, error } = await supabase
    .from('postos')
    .select(`
      *,
      combustiveis (*)
    `)
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return normalizarPostos(data || []);
}

export async function cadastrarPosto({
  donoId,
  nome,
  endereco,
  telefone,
  gasolina,
  etanol,
  diesel,
  latitude,
  longitude,
}) {
  const { data: posto, error: erroPosto } = await supabase
    .from('postos')
    .insert([
      {
        dono_id: donoId,
        nome: nome.trim(),
        endereco: endereco.trim(),
        telefone: telefone?.trim() || null,
        latitude: latitude || null,
        longitude: longitude || null,
        status: 'pendente',
      },
    ])
    .select()
    .single();

  if (erroPosto) {
    throw new Error(erroPosto.message);
  }

  const combustiveis = [
    {
      posto_id: posto.id,
      tipo: 'gasolina',
      preco: converterPrecoParaNumero(gasolina),
    },
    {
      posto_id: posto.id,
      tipo: 'etanol',
      preco: converterPrecoParaNumero(etanol),
    },
  ];

  if (diesel?.trim()) {
    combustiveis.push({
      posto_id: posto.id,
      tipo: 'diesel',
      preco: converterPrecoParaNumero(diesel),
    });
  }

  const { error: erroCombustiveis } = await supabase
    .from('combustiveis')
    .insert(combustiveis);

  if (erroCombustiveis) {
    throw new Error(erroCombustiveis.message);
  }

  return posto;
}

export async function aprovarPosto(id) {
  const { error } = await supabase
    .from('postos')
    .update({ status: 'aprovado' })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function rejeitarPosto(id) {
  const { error } = await supabase
    .from('postos')
    .update({ status: 'rejeitado' })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

function normalizarPostos(postos) {
  return postos.map((posto) => {
    const combustiveis = posto.combustiveis || [];

    const gasolina = combustiveis.find((item) => item.tipo === 'gasolina');
    const etanol = combustiveis.find((item) => item.tipo === 'etanol');
    const diesel = combustiveis.find((item) => item.tipo === 'diesel');

    return {
      ...posto,
      gasolina: gasolina ? formatarPreco(gasolina.preco) : null,
      etanol: etanol ? formatarPreco(etanol.preco) : null,
      diesel: diesel ? formatarPreco(diesel.preco) : null,
    };
  });
}

function formatarPreco(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return null;
  }

  return numero.toFixed(2).replace('.', ',');

  
}

export async function buscarMeuPosto(donoId) {
  const { data, error } = await supabase
    .from('postos')
    .select(`
      *,
      combustiveis (*)
    `)
    .eq('dono_id', donoId)
    .order('criado_em', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return normalizarPostos([data])[0];
}

export async function atualizarPrecosPosto({ postoId, gasolina, etanol, diesel }) {
  const combustiveis = [
    {
      tipo: 'gasolina',
      preco: converterPrecoParaNumero(gasolina),
    },
    {
      tipo: 'etanol',
      preco: converterPrecoParaNumero(etanol),
    },
  ];

  if (diesel?.trim()) {
    combustiveis.push({
      tipo: 'diesel',
      preco: converterPrecoParaNumero(diesel),
    });
  }

  for (const combustivel of combustiveis) {
    const { data: existente, error: erroBusca } = await supabase
      .from('combustiveis')
      .select('*')
      .eq('posto_id', postoId)
      .eq('tipo', combustivel.tipo)
      .maybeSingle();

    if (erroBusca) {
      throw new Error(erroBusca.message);
    }

    if (existente) {
      const { error: erroUpdate } = await supabase
        .from('combustiveis')
        .update({
          preco: combustivel.preco,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', existente.id);

      if (erroUpdate) {
        throw new Error(erroUpdate.message);
      }
    } else {
      const { error: erroInsert } = await supabase
        .from('combustiveis')
        .insert([
          {
            posto_id: postoId,
            tipo: combustivel.tipo,
            preco: combustivel.preco,
          },
        ]);

      if (erroInsert) {
        throw new Error(erroInsert.message);
      }
    }
  }
}