export const PokeCards = ({ pokemonData }) => {
  // Mapping Pokémon types to colors
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  // Get the first type for background effect
  const mainType = pokemonData.types[0].type.name;
  const bgColor = typeColors[mainType] || "#ccc";

  return (
    <li className="pokemon-card" style={{ "--type-color": bgColor }}>
      {/* Animated Rising Glob */}
      <div className="pokemon-hover-bg"></div>

      
      <figure>
        <img
          src={pokemonData.sprites.other["official-artwork"].front_default}
          alt={pokemonData.name}
          className="pokemon-image"
        />
      </figure>

      <h1 className="pokemon-name">{pokemonData.name}</h1>

      
      <div className="pokemon-types">
        {pokemonData.types.map((curType, index) => (
          <span
            key={index}
            className="pokemon-type"
            style={{ backgroundColor: typeColors[curType.type.name] || "#ccc" }}
          >
            {curType.type.name}
          </span>
        ))}
      </div>

      
      <div className="grid-three-cols">
        <p className="pokemon-info">
          <span>Height:</span> {pokemonData.height}
        </p>
        <p className="pokemon-info">
          <span>Weight:</span> {pokemonData.weight}
        </p>
        <p className="pokemon-info">
          <span>Speed:</span> {pokemonData.stats[5].base_stat}
        </p>
      </div>

      <div className="grid-three-cols">
        <div className="pokemon-info">
          <p>{pokemonData.base_experience}</p>
          <span> Experience:</span>
        </div>
        <div className="pokemon-info">
          <p>{pokemonData.stats[1].base_stat}</p>
          <span> Attack:</span>
        </div>
        <div className="pokemon-info">
          <p>
            {pokemonData.abilities
              .map((abilityInfo) => abilityInfo.ability.name)
              .slice(0, 1)
              .join(", ")}
          </p>
          <span> Ability:</span>
        </div>
      </div>
    </li>
  );
};
