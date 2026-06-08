import { useCallback, useEffect, useState } from 'react';

import { listarNoticias } from '../services/noticiasService';
import { listarPostosAprovados } from '../services/postosService';

export function useHomeResumo() {
  const [resumo, setResumo] = useState({
    totalPostos: 0,
    totalNoticias: 0,
    menorGasolina: null,
    menorEtanol: null,
    melhorPostoGasolina: null,
    ultimaNoticia: null,
  });

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarResumo = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');

      const [postos, noticias] = await Promise.all([
        listarPostosAprovados(),
        listarNoticias(),
      ]);

      const postosComGasolina = postos.filter((posto) => posto.gasolina);
      const postosComEtanol = postos.filter((posto) => posto.etanol);

      const melhorPostoGasolina = postosComGasolina.reduce((menor, atual) => {
        if (!menor) {
          return atual;
        }

        const precoMenor = converterPreco(menor.gasolina);
        const precoAtual = converterPreco(atual.gasolina);

        return precoAtual < precoMenor ? atual : menor;
      }, null);

      const melhorPostoEtanol = postosComEtanol.reduce((menor, atual) => {
        if (!menor) {
          return atual;
        }

        const precoMenor = converterPreco(menor.etanol);
        const precoAtual = converterPreco(atual.etanol);

        return precoAtual < precoMenor ? atual : menor;
      }, null);

      setResumo({
        totalPostos: postos.length,
        totalNoticias: noticias.length,
        menorGasolina: melhorPostoGasolina?.gasolina || null,
        menorEtanol: melhorPostoEtanol?.etanol || null,
        melhorPostoGasolina,
        ultimaNoticia: noticias[0] || null,
      });
    } catch (error) {
      console.log('Erro ao carregar resumo da home:', error.message);
      setErro('Não foi possível carregar o resumo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  return {
    resumo,
    loading,
    erro,
    recarregar: carregarResumo,
  };
}

function converterPreco(valor) {
  return Number(String(valor).replace(',', '.'));
}