import { useCallback, useEffect, useState } from 'react';
import { listarNotificacoes } from '../services/notificacoesService';

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');

      const data = await listarNotificacoes();
      setNotificacoes(data);
    } catch (error) {
      setErro('Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
    }
  }, []);

  function marcarComoLida(id) {
    setNotificacoes((atual) =>
      atual.map((item) =>
        item.id === id ? { ...item, lida: true } : item
      )
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atual) =>
      atual.map((item) => ({
        ...item,
        lida: true,
      }))
    );
  }

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  const naoLidas = notificacoes.filter((item) => !item.lida).length;

  return {
    notificacoes,
    loading,
    erro,
    naoLidas,
    recarregar: carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}