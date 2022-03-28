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

function getPokemonName(index) {
    let name = loadedPokemon[index]['name'];
    return name.replace(/(^|\/|-)(\S)/g, s => s.toUpperCase()); // https://stackoverflow.com/questions/41490076/capitalize-every-letter-after-and-characters
}

function getPokemonType(index, typeIndex) {
    if (loadedPokemon[index]['types'][typeIndex]) {
        return loadedPokemon[index]['types'][typeIndex]['type']['name'];
    } else {
        return '';
    }
}

function showPokemonDetails(index) {
    let container = document.getElementById('pokemon-details-container');
    document.body.style.overflow = 'hidden';

    container.classList.remove('d-none');
    container.innerHTML = generatePokemonDetailsCardHTML(index);

}

function closePokemonDetails() {
    let container = document.getElementById('pokemon-details-container');
    container.classList.add('d-none');
    container.innerHTML = '';

    document.body.style.overflow = 'auto';
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

function capitalize(string) {
    return string.toUpperCase();
}

function getPokemonImg(index) {
    if (loadedPokemon[index]['sprites']['other']['official-artwork']['front_default']) {
        return loadedPokemon[index]['sprites']['other']['official-artwork']['front_default'];
    } else {
        return './img/pokeball.svg';
    }
}

function getPokemonStat(index, stat) {
    return loadedPokemon[index]['stats'][stat]['base_stat'];
}

function getPokemonStatPercent(index, stat) {
    let stats = loadedPokemon[index]['stats'][stat]['base_stat'];
    return (stats / 255) * 100;
}

function getPokemonTypeHexColor(type) {
    switch (type) {
        case 'normal':
            return '#a9a977';
            break;

        case 'fighting':
            return '#c03028';
            break;

        case 'flying':
            return '#98a4e0';
            break;

        case 'poison':
            return '#bb5a9f';
            break;

        case 'ground':
            return '#e7d4a9';
            break;

        case 'rock':
            return '#bea563';
            break;

        case 'bug':
            return '#a9bd42';
            break;

        case 'ghost':
            return '#6663b2';
            break;

        case 'steel':
            return '#afadc3';
            break;

        case 'fire':
            return '#fe4833';
            break;

        case 'water':
            return '#1f93f6';
            break;

        case 'grass':
            return '#74d767';
            break;

        case 'electric':
            return '#fec446';
            break;

        case 'psychic':
            return '#fd6fa1';
            break;

        case 'ice':
            return '#47cee4';
            break;

        case 'dragon':
            return '#8667ee';
            break;

        case 'dark':
            return '#765a4e';
            break;

        case 'fairy':
            return '#fdb6f2';
            break;
    }
}