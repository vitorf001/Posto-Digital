import { useCallback, useEffect, useState } from 'react';
import { buscarMeuPosto } from '../services/postosService';
import { useAuth } from './useAuth';

export function useMeuPosto() {
  const { usuario } = useAuth();

  const [posto, setPosto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarMeuPosto = useCallback(async () => {
    if (!usuario?.id) {
      setLoading(false);
      setPosto(null);
      return;
    }

    try {
      setLoading(true);
      setErro('');

      const data = await buscarMeuPosto(usuario.id);
      setPosto(data);
    } catch (error) {
      console.log('Erro ao buscar meu posto:', error.message);
      setErro('Não foi possível carregar seu posto.');
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    carregarMeuPosto();
  }, [carregarMeuPosto]);

  return {
    posto,
    loading,
    erro,
    recarregar: carregarMeuPosto,
  };
}