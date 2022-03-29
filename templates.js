function generatePokedexCardHTML(array, i) {
    let arrayName;

    if (array == loadedPokemon) {
        arrayName = 'loadedPokemon';
    } else if (array = favoritePokemons) {
        arrayName = 'favoritePokemons';
    }

    return `
            <div class="pokedex-card" onclick="showPokemonDetails(${arrayName}, ${i})"> 
                <div class="pokedex-card-header">
                    <span class="pokemon-id">#${getPokemonID(array, i)}</span>
                    <img src="${getPokemonImg(array, i)}" alt="No Image found!" class="pokemon-img">
                </div>
                <div class="pokedex-card-body">
                    <span class="pokemon-name">${getPokemonName(array, i)}</span>
                    <br>
                    <div class="pokemon-types">
                        <span class="pokemon-type" style="background-color: ${getPokemonTypeHexColor(getPokemonType(array, i, 0))}">${capitalize(getPokemonType(array, i, 0))}</span>
                        <span class="pokemon-type ${getPokemonType(array, i, 1)}" style="background-color: ${getPokemonTypeHexColor(getPokemonType(array, i, 1))}">${capitalize(getPokemonType(array, i, 1))}</span>
                    </div>
                </div>
            </div>
        `;
}

function generatePokemonDetailsCardHTML(array, i) {
    let arrayName;

    if (array == loadedPokemon) {
        arrayName = 'loadedPokemon';
    } else if (array = favoritePokemons) {
        arrayName = 'favoritePokemons';
    }

    return `
        <div class="pokemon-details-card">
            <div class="pokemon-details-header">
                <button onclick="closePokemonDetails()" class="close-details-btn btns" title="Close!">
                    <img src="./img/icons/close.svg" alt="Close">
                </button>
                <img src="${getPokemonImg(array, i)}" alt="No Image found!" class="pokemon-img pokemon-details-img">
            </div>
            <div class="pokemon-details-body">
                <div class="pokemon-name-container">
                    <span class="pokemon-name pokemon-details-name">${getPokemonName(array, i)}</span>
                    <button class="favorite-btn btns" title="Save me!" onclick="favoritePokemon(${arrayName}, ${i})">
                        <img src="${getPokemonFavoriteState(array, i)}" alt="Favorite" id="fav-icon-pokemon-index-${i}">
                    </button>
                </div>
                <div class="pokemon-stats">
                    <div class="pokemon-stat">
                        <span class="pokemon-properties">HP</span>
                        <div class="progress">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${getPokemonStatPercent(array, i, 0)}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${getPokemonStat(array, i, 0)}</div>
                        </div>
                        <span class="pokemon-properties">255</span>
                    </div>
                    <div class="pokemon-stat">
                        <span class="pokemon-properties">ATK</span>
                        <div class="progress">
                            <div class="progress-bar bg-info" role="progressbar" style="width: ${getPokemonStatPercent(array, i, 1)}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${getPokemonStat(array, i, 1)}</div>
                        </div>
                        <span class="pokemon-properties">255</span>
                    </div>
                    <div class="pokemon-stat">
                        <span class="pokemon-properties">DEF</span>
                        <div class="progress">
                            <div class="progress-bar bg-warning" role="progressbar" style="width: ${getPokemonStatPercent(array, i, 2)}%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">${getPokemonStat(array, i, 2)}</div>
                        </div>
                        <span class="pokemon-properties">255</span>
                    </div>
                    <div class="pokemon-stat">
                        <span class="pokemon-properties">S-ATK</span>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: ${getPokemonStatPercent(array, i, 3)}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${getPokemonStat(array, i, 3)}</div>
                        </div>
                        <span class="pokemon-properties">255</span>
                    </div>
                    <div class="pokemon-stat">
                        <span class="pokemon-properties">S-DEF</span>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: ${getPokemonStatPercent(array, i, 4)}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${getPokemonStat(array, i, 4)}</div>
                        </div>
                        <span class="pokemon-properties">255</span>
                    </div>
                    <div class="pokemon-stat">
                        <span class="pokemon-properties">SPEED</span>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: ${getPokemonStatPercent(array, i, 5)}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${getPokemonStat(array, i, 5)}</div>
                        </div>
                        <span class="pokemon-properties">255</span>
                    </div>
                </div>
            </div>
            <div class="pokemon-details-footer">
                <span class="pokemon-properties">Height: ${getPokemonProperties(array, i, 'height') / 10}m</span>
                <span class="pokemon-properties">Weight: ${getPokemonProperties(array, i, 'weight') / 10}kg</span>
                <div>
                    <span class="pokemon-properties">Abilities:</span>
                    <span class="pokemon-properties">${getPokemonAbilities(array, i, 0)}</span>
                    <span class="pokemon-properties ${getPokemonAbilities(array, i, 1)}">& ${getPokemonAbilities(array, i, 1)}</span>
                </div>
            </div>
        </div>
    `;
}