export function formatDate(dataISO) {
  if (!dataISO) {
    return '';
  }

  const data = new Date(dataISO);

  if (Number.isNaN(data.getTime())) {
    return '';
  }

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}