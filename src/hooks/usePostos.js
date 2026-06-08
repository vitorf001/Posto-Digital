import { useCallback, useEffect, useState } from 'react';
import { listarPostosAprovados } from '../services/postosService';

export function usePostos() {
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarPostos = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');

      const data = await listarPostosAprovados();
      setPostos(data);
    } catch (error) {
      console.log('Erro ao carregar postos:', error.message);
      setErro('Não foi possível carregar os postos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPostos();
  }, [carregarPostos]);

  return {
    postos,
    loading,
    erro,
    recarregar: carregarPostos,
  };
}