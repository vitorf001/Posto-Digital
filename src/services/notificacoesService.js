const notificacoesFake = [
  {
    id: '1',
    titulo: 'Preço atualizado',
    mensagem: 'O Posto Central atualizou o preço da gasolina para R$ 5,79.',
    tipo: 'preco',
    data: 'Hoje',
    lida: false,
  },
  {
    id: '2',
    titulo: 'Novo posto disponível',
    mensagem: 'Um novo posto foi cadastrado próximo à sua região.',
    tipo: 'posto',
    data: 'Ontem',
    lida: false,
  },
  {
    id: '3',
    titulo: 'Notícia publicada',
    mensagem: 'Confira a nova notícia sobre atualização de combustíveis.',
    tipo: 'noticia',
    data: '2 dias atrás',
    lida: true,
  },
];

function simularDelay(resultado) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(resultado);
    }, 500);
  });
}

export async function listarNotificacoes() {
  return simularDelay(notificacoesFake);
}