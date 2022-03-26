function generatePokedexCardHTML(i) {
    return `
            <div class="pokedex-card" onclick=""> 
                <div class="pokedex-card-header">
                    <span class="pokemon-id">#${loadedPokemon[i]['id']}</span>
                    <img src="${getPokemonImg(i)}" alt="No Image found!" class="pokemon-img">
                </div>
                <div class="pokedex-card-body">
                    <b>${capitalizeFirstLetter(loadedPokemon[i]['name'])}</b>
                    <br>
                    <span>Types: ${capitalizeFirstLetter(getPokemonType1(i))}, ${capitalizeFirstLetter(getPokemonType2(i))}</span>
                </div>
            </div>
        `;
}