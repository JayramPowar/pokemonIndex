import { useEffect, useState } from "react";
import "./index.css";
import { PokeCards } from "./PokeCards";
import { useFetchApiData } from "./FetchApiData";
import { ErrorHandling } from "./ErrorHandling";

export const Pokeapi = () => {
  const API = "https://pokeapi.co/api/v2/pokemon";
  const POKEMON_PER_PAGE = 50;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [pageInput, setPageInput] = useState("1");
  const { pokemon, loading, error,  } = useFetchApiData(API);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pokemonTypes = Array.from(
    new Set(
      pokemon.flatMap((curPokemon) =>
        curPokemon.types.map((typeInfo) => typeInfo.type.name)
      )
    )
  ).sort();

  const filteredPokemon = pokemon.filter((curPokemon) => {
    const matchesName = curPokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      curPokemon.types.some((typeInfo) => typeInfo.type.name === selectedType);

    return matchesName && matchesType;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPokemon.length / POKEMON_PER_PAGE)
  );
  const paginatedPokemon = filteredPokemon.slice(
    (currentPage - 1) * POKEMON_PER_PAGE,
    currentPage * POKEMON_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage <= 1) {
        return 1;
      }

      return prevPage - 1;
    });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage >= totalPages) {
        return totalPages;
      }

      return prevPage + 1;
    });
  };

  const handlePageJump = (e) => {
    e.preventDefault();

    const parsedPage = Number(pageInput);

    if (Number.isNaN(parsedPage)) {
      setPageInput(String(currentPage));
      return;
    }

    const nextPage = Math.min(Math.max(parsedPage, 1), totalPages);
    setCurrentPage(nextPage);
  };

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
            <div className="pokemon-filters">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                {pokemonTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <ul className="cards">
                {paginatedPokemon.map((curPokemon) => (
                  <PokeCards key={curPokemon.id} pokemonData={curPokemon} />
                ))}
              </ul>
            </div>

            <div className="pagination">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p className="pagination-status">
                Page {currentPage} of {totalPages}
              </p>
              <form className="pagination-jump" onSubmit={handlePageJump}>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  aria-label="Jump to page"
                />
                <button type="submit">Go</button>
              </form>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>

            <button
              type="button"
              className="scroll-top-button"
              onClick={scrollToTop}
              aria-label="Go to top"
            >
              ↑
            </button>
          </>
        )}
      </section>
    </>
  );
};
