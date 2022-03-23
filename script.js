'use strict';

let offset = 0; // Starting point
let limit = 25;
let numberOfAllPokemon = 1126;

let allPokemonNames = [];
let searchedPokemon = [];
let pokemon = []; // Global array to store fetched Pokemon

function init() {
    loadPokemonAPI();
    loadAllPokemon();
}

async function loadAllPokemon() {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${numberOfAllPokemon}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    console.log('All Pokemon: ', responseJSON);

    getAllPokemon(responseJSON);
}

function getAllPokemon(responseJSON) {
    for (let i = 0; i < responseJSON['results'].length; i++) {
        allPokemonNames.push(responseJSON['results'][i]);
    }
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
			<div class="pokedex-card" onclick="showPokemonDetails(${i})"> 
				<div class="pokedex-card-header">
                    <span class="pokemon-id">#${pokemon[i]['id']}</span>
					<img src="${pokemon[i]['sprites']['other']['dream_world']['front_default']}" class="pokemon-img">
				</div>
				<div class="pokedex-card-body">
			        <span>Name: ${pokemon[i]['name']}</span>
                    <span>Type: ${getPokemonType1(i)}</span>
                    <span>Type: ${getPokemonType2(i)}</span>
				</div>
			</div>
		`;
    }
}

function getPokemonType1(i) {
    if (pokemon[i]['types'][0]) {
        return pokemon[i]['types'][0]['type']['name'];
    } else {
        return '';
    }
}

function getPokemonType2(i) {
    if (pokemon[i]['types'][1]) {
        return pokemon[i]['types'][1]['type']['name'];
    } else {
        return '';
    }
}

function showPokemonDetails(i) {
    let container = document.getElementById('pokemon-details-container');
    container.classList.remove('d-none');
    container.innerHTML = `
        <div>
            <div class="pokemon-details-header">
                <button onclick="closePokemonDetails()">Close</button>
            </div>
            <div class="pokemon-details-body">
            </div>
        </div>
    `;

}

function closePokemonDetails() {
    let container = document.getElementById('pokemon-details-container');
    container.classList.remove('d-none');
}

function loadMorePokemon() {
    offset += 25;
    init();
}

async function filterPokemon() {
    let searchText = document.getElementById('search-input').value.toLowerCase();
    console.log(searchText);

    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    for (let i = 0; i < allPokemonNames.length; i++) {

        if (allPokemonNames[i]['name'].toLowerCase().includes(searchText)) {
            const url = allPokemonNames[i]['url'];
            const response = await fetch(url);
            const responseJSON = await response.json();
            searchedPokemon.push(responseJSON);
        }
    }

    for (let j = 0; j < searchedPokemon.length; j++) {
        if (searchedPokemon[j]['name'].toLowerCase().includes(searchText)) {
            console.log(searchedPokemon[j]);
            container.innerHTML += `
				<div class="pokedex-card">
					<div class="pokedex-card-header">
						<img src="${searchedPokemon[j]['sprites']['front_default']}" class="pokemon-img">
					</div>
					<div class="pokedex-card-body">
						<p>ID: ${searchedPokemon[j]['id']} Name: ${searchedPokemon[j]['name']}</p>
					</div>
				</div>

			`;
        }
    }
}