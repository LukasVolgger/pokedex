'use strict';

let offset = 0; // Starting point
let limit = 25;
const totalPokemonURL = 'https://pokeapi.co/api/v2/pokemon/'; // List Of total Pokemon count and names URL

let pokemon = []; // Global array to store fetched Pokemon

function init() {
    loadPokemonAPI();
}

async function loadPokemonAPI() {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const responseJSON = await response.json();

    console.log('Response API JSON: ', responseJSON);
    console.log('Response API JSON results: ', responseJSON['results']);

    getPokemon(responseJSON);
}

async function getPokemon(responseJSON) {
    for (let i = 0; i < responseJSON['results'].length; i++) {
        const url = responseJSON['results'][i]['url'];
        const responseSinglePokemon = await fetch(url);
        const responseSinglePokemonJSON = await responseSinglePokemon.json();

        // console.log(`Response single Pokemon ID. ${i + 1} JSON:`, responseSinglePokemonJSON);

        pokemon.push(responseSinglePokemonJSON); // Push all Pokemon in global array - After every recall +offset
    }

    renderPokemon();
}

function renderPokemon() {
    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    for (let i = 0; i < pokemon.length; i++) {
        container.innerHTML += `
			<div class="pokedex-card">
				<div class="pokedex-card-header">
					<img src="${pokemon[i]['sprites']['other']['dream_world']['front_default']}" class="pokemon-img">
				</div>
				<div class="pokedex-card-body">
					<p>ID: ${pokemon[i]['id']} Name: ${pokemon[i]['name']}</p>
				</div>
			</div>
		`;
    }
}

function loadMorePokemon() {
    offset += 25;
    init();
}

function filterPokemon() {
    let searchText = document.getElementById('search-input').value.toLowerCase();
    console.log(searchText);

    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    for (let i = 0; i < pokemon.length; i++) {

        if (pokemon[i]['name'].toLowerCase().includes(searchText)) {
            container.innerHTML += `
				<div class="pokedex-card">
					<div class="pokedex-card-header">
						<img src="${pokemon[i]['sprites']['other']['dream_world']['front_default']}" class="pokemon-img">
					</div>
					<div class="pokedex-card-body">
						<p>ID: ${pokemon[i]['id']} Name: ${pokemon[i]['name']}</p>
					</div>
				</div>

			`;
        }
    }
}