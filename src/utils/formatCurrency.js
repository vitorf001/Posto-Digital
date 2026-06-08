export function formatCurrency(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return 'R$ 0,00';
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function converterPrecoParaNumero(valor) {
  if (!valor) {
    return NaN;
  }

  const valorLimpo = String(valor)
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(',', '.')
    .trim();

  return Number(valorLimpo);
}

export function formatarPrecoDigitado(valor) {
  return String(valor)
    .replace(/[^\d,.]/g, '')
    .replace('.', ',');
}