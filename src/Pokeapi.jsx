import { useState } from "react";
import "./index.css";
import { PokeCards } from "./PokeCards";
import { useFetchApiData } from "./FetchApiData";
import { ErrorHandling } from "./ErrorHandling";

export const Pokeapi = () => {
  const API = "https://pokeapi.co/api/v2/pokemon?limit=451";
  const { pokemon, loading, error } = useFetchApiData(API);

  const [search, setSearch] = useState("");

  const filterSearch = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="container">
        
         
          <h1>
            Welcome to my <span className="pokedex">Pokedex</span>
          </h1>
        

        <ErrorHandling loading={loading} error={error} />

        {!loading && !error && (
          <>
            <div className="pokemon-search">
              <input
                type="text"
                placeholder="Search Pokemon"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <ul className="cards">
                {filterSearch.map((curPokemon) => (
                  <PokeCards key={curPokemon.id} pokemonData={curPokemon} />
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </>
  );
};
