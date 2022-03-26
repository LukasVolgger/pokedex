'use strict';

// Pagination Settings
let offset = 0;
let limit = 25;

// All Pokemon names and url 
let numberOfAllPokemon = 1126;
let allPokemonNamesAndUrl = [];

// Save Pokemons
let loadedPokemon = []; // Stores all Pokemon which were loaded before from pagination or filter
let searchedPokemon = []; // Stores all Pokemon which were already filtered by user

function init() {
    loadPokemonPagination();
    loadAllPokemonNamesAndUrl();
}

async function loadAllPokemonNamesAndUrl() {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${numberOfAllPokemon}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    // console.log('All Pokemon: ', responseJSON);

    // Push all fetched names and Url's into an array
    for (let i = 0; i < responseJSON['results'].length; i++) {
        allPokemonNamesAndUrl.push(responseJSON['results'][i]);
    }
}

async function loadPokemonPagination() {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const responseJSON = await response.json();

    // console.log('Response API JSON: ', responseJSON);
    // console.log('Response API JSON results: ', responseJSON['results']);
    getPokemonForPagination(responseJSON);
}

async function getPokemonForPagination(responseJSON) {
    for (let i = 0; i < responseJSON['results'].length; i++) {
        const url = responseJSON['results'][i]['url'];
        const responseSinglePokemon = await fetch(url);
        const responseSinglePokemonJSON = await responseSinglePokemon.json();

        loadedPokemon.push(responseSinglePokemonJSON); // Push all Pokemon in global array - After every recall +offset
    }

    renderPokemon();
}

function renderPokemon() {
    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    for (let i = 0; i < loadedPokemon.length; i++) {
        container.innerHTML += generatePokedexCardHTML(i);
    }
}

function getPokemonType1(i) {
    if (loadedPokemon[i]['types'][0]) {
        return loadedPokemon[i]['types'][0]['type']['name'];
    } else {
        return '';
    }
}

function getPokemonType2(i) {
    if (loadedPokemon[i]['types'][1]) {
        return loadedPokemon[i]['types'][1]['type']['name'];
    } else {
        return '-';
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
    loadPokemonPagination();
}

async function filterPokemon() {
    let searchText = document.getElementById('search-input').value.toLowerCase();
    console.log('Search Text: ', searchText);

    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    for (let i = 0; i < allPokemonNamesAndUrl.length; i++) {

        if (allPokemonNamesAndUrl[i]['name'].toLowerCase().includes(searchText)) {
            const url = allPokemonNamesAndUrl[i]['url'];
            const response = await fetch(url);
            const responseJSON = await response.json();

            searchedPokemon.push(responseJSON);

            for (let i = 0; i < searchedPokemon.length; i++) {
                const pokemon = searchedPokemon[i];
                let pokemonInArray = loadedPokemon.find(p => p['name'] == pokemon['name']);
                // let pokemonInArray = loadedPokemon.find(function(p) {
                //     return p['name'] == pokemon['name'];
                // });
                if (!pokemonInArray) {
                    loadedPokemon.push(pokemon);
                }
            }


        }
    }


    for (let j = 0; j < loadedPokemon.length; j++) {
        if (loadedPokemon[j]['name'].toLowerCase().includes(searchText)) {
            container.innerHTML += generatePokedexCardHTML(j);
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPokemonImg(i) {
    if (loadedPokemon[i]['sprites']['other']['official-artwork']['front_default']) {
        return loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
    } else {
        return './img/pokeball.svg';
    }
}