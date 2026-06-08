import { useCallback, useEffect, useState } from 'react';
import { listarNoticias } from '../services/noticiasService';

export function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarNoticias = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');

      const data = await listarNoticias();
      setNoticias(data);
    } catch (error) {
      console.log('Erro ao carregar notícias:', error.message);
      setErro('Não foi possível carregar as notícias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarNoticias();
  }, [carregarNoticias]);

  return {
    noticias,
    loading,
    erro,
    recarregar: carregarNoticias,
  };
}