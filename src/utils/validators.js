import { converterPrecoParaNumero } from './formatCurrency';

export function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(String(email).trim());
}

export function validarSenha(senha) {
  return String(senha).length >= 6;
}

export function validarPreco(valor) {
  const preco = converterPrecoParaNumero(valor);

  return Number.isFinite(preco) && preco > 0;
}

export function validarTextoObrigatorio(texto) {
  return String(texto || '').trim().length > 0;
}