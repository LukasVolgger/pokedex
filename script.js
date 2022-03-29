// TODO Refactor all js files
// TODO Comment alls functions

'use strict';

// Pagination Settings
let offset = 0;
let limit = 25;

// All Pokemon names and url 
let numberOfAllPokemon = 1126;
let allPokemonNamesAndUrl = [];

// Save Pokemon
let loadedPokemon = []; // Stores all Pokemon which were loaded before from pagination or filter
let searchedPokemon = []; // Stores all Pokemon which were already filtered by user
let favoritePokemon = [];

let userIsOnHome = true;

loadFromLocalStorage();

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

    renderPokemon(loadedPokemon);
}

function saveToLocalStorage() {
    // let loadedPokemonAsString = JSON.stringify(loadedPokemon);
    // let searchedPokemonAsString = JSON.stringify(searchedPokemon);
    let favoritePokemonAsString = JSON.stringify(favoritePokemon);

    // localStorage.setItem('loadedPokemon', loadedPokemonAsString);
    // localStorage.setItem('searchedPokemon', searchedPokemonAsString);
    localStorage.setItem('favoritePokemon', favoritePokemonAsString);
}

function loadFromLocalStorage() {
    // let loadedPokemonAsString = localStorage.getItem('loadedPokemon');
    // let searchedPokemonAsString = localStorage.getItem('searchedPokemon');
    let favoritePokemonAsString = localStorage.getItem('favoritePokemon');

    // loadedPokemon = JSON.parse(loadedPokemonAsString);
    // searchedPokemon = JSON.parse(searchedPokemonAsString);
    favoritePokemon = JSON.parse(favoritePokemonAsString);
}

function renderPokemon(array) {
    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
        container.innerHTML += generatePokedexCardHTML(array, i);
    }
}

function getPokemonName(array, index) {
    let name = array[index]['name'];
    return name.replace(/(^|\/|-)(\S)/g, s => s.toUpperCase()); // https://stackoverflow.com/questions/41490076/capitalize-every-letter-after-and-characters
}

function getPokemonType(array, index, typeIndex) {
    if (array[index]['types'][typeIndex]) {
        return array[index]['types'][typeIndex]['type']['name'];
    } else {
        return 'd-none';
    }
}

function showPokemonDetails(array, index) {
    let container = document.getElementById('pokemon-details-container');
    document.body.style.overflow = 'hidden';

    container.classList.remove('d-none');
    container.innerHTML = generatePokemonDetailsCardHTML(array, index);

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
    userIsOnHome = false;

    let searchText = document.getElementById('search-input').value.toLowerCase();
    // console.log('Search Text: ', searchText);

    document.getElementById('search-input').value = '';

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
            container.innerHTML += generatePokedexCardHTML(loadedPokemon, j);
        }
    }
}

function capitalize(string) {
    if (string) {
        return string.toUpperCase();
    }
}

function getPokemonID(array, index) {
    return array[index]['id'];
}

function getPokemonImg(array, index) {
    if (array[index]['sprites']['other']['official-artwork']['front_default']) {
        return array[index]['sprites']['other']['official-artwork']['front_default'];
    } else {
        return './img/no_image.svg';
    }
}

function getPokemonStat(array, index, stat) {
    return array[index]['stats'][stat]['base_stat'];
}

function getPokemonStatPercent(array, index, stat) {
    let stats = array[index]['stats'][stat]['base_stat'];
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

function getPokemonProperties(array, index, property) {
    return array[index][property];
}

function getPokemonAbilities(array, index, abilityIndex) {
    if (array[index]['abilities'][abilityIndex]) {
        return array[index]['abilities'][abilityIndex]['ability']['name'].replace(/(^|\/|-)(\S)/g, s => s.toUpperCase());
    } else {
        return 'd-none';
    }
}

function setFavoritePokemon(array, index) {
    if (array[index]['favorite'] == undefined) {
        loadedPokemon[index]['favorite'] = false;
    }

    array[index]['favorite'] = !array[index]['favorite'];

    if (array[index]['favorite'] == true) {
        document.getElementById(`fav-icon-pokemon-index-${index}`).src = './img/icons/favorite_saved.svg';
        favoritePokemon.push(loadedPokemon[index]);
        array[index]['favorite-index'] = favoritePokemon.length - 1;
    } else {
        document.getElementById(`fav-icon-pokemon-index-${index}`).src = './img/icons/favorite.svg';
        array[index]['favorite'] = false;
        array[index]['favorite-index'] = [];
        favoritePokemon.pop(array[index]['favorite-index'], 1);
    }
    saveToLocalStorage();
}

function getPokemonFavoriteState(array, index) {
    if (array[index]['favorite'] == true) {
        return './img/icons/favorite_saved.svg';
    } else {
        return './img/icons/favorite.svg';
    }
}

function home() {
    userIsOnHome = true;
    renderPokemon(loadedPokemon);
}

function showFavoritePokemon() {
    if (favoritePokemon.length > 0) {
        renderPokemon(favoritePokemon);
    } else {
        window.alert('There are no Pokemons to display! Go and catch some you like!');
    }
}

window.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && userIsOnHome) {
        // console.log('Scrolled to bottom!');
        loadMorePokemon();
    }
});