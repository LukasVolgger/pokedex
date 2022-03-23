function generatePokedexCardHTML(i) {
    return `
            <div class="pokedex-card" onclick="showPokemonDetails(${i})"> 
                <div class="pokedex-card-header">
                    <span class="pokemon-id">#${loadedPokemon[i]['id']}</span>
                    <img src="${loadedPokemon[i]['sprites']['other']['dream_world']['front_default']}" class="pokemon-img">
                </div>
                <div class="pokedex-card-body">
                    <span>Name: ${loadedPokemon[i]['name']}</span>
                    <span>Type: ${getPokemonType1(i)}</span>
                    <span>Type: ${getPokemonType2(i)}</span>
                </div>
            </div>
        `;
}