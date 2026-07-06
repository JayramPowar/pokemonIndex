import { useState, useEffect, useCallback } from "react";

export const useFetchApiData = (baseAPI) => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPokemon = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const listResponse = await fetch(`${baseAPI}?limit=100000&offset=0`, {
        signal,
      });

      if (!listResponse.ok) {
        throw new Error("Failed to fetch Pokemon list.");
      }

      const data = await listResponse.json();
      setTotalCount(data.count);

      const detailsPokemonData = data.results.map(async (curPokemon) => {
        const response = await fetch(curPokemon.url, { signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch details for ${curPokemon.name}.`);
        }

        return response.json();
      });

      const detailedResponse = await Promise.all(detailsPokemonData);
      setPokemon(detailedResponse);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      setError(err);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [baseAPI]);

  useEffect(() => {
    const controller = new AbortController();

    fetchPokemon(controller.signal);

    return () => controller.abort();
  }, [fetchPokemon]);

  return { pokemon, loading, error, totalCount };
};
