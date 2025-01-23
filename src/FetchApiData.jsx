import { useState, useEffect, useCallback } from "react";

export const useFetchApiData = (API) => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPokemon = useCallback(async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const detailsPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponse = await Promise.all(detailsPokemonData);
      setPokemon(detailedResponse);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  }, [API]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return { pokemon, loading, error };
};
