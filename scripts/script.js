'use strict';

// ####################################### GLOBAL SCOPE #######################################

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

// ####################################### INIT, FETCH API #######################################

loadFromLocalStorage();

function init() {
    loadPokemonPagination();
    loadAllPokemonNamesAndUrl();
    autocomplete(document.getElementById("search-input"), allPokemonNamesAndUrl);
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

function mock() {
    return new Promise(resolve => setTimeout(() => resolve({ json: () => Promise.resolve([1, 2, 3]) }), 2000));
};

async function loadPokemonPagination() {
    try {
        showLoadingScreen();

        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
        const response = await fetch(url);
        const responseJSON = await response.json();
        getPokemonForPagination(responseJSON);

        const res = await mock();
        const states = await res.json();
        console.log("fetching completes");
        console.log("states:", states);
    } catch (error) {
        console.log(error.toString());
    } finally {
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000)
    }
}

async function getPokemonForPagination(responseJSON) {
    // The response from loadPokemonPagination() stores the pokemon in ['results']. Now we get each of the pokemon 
    for (let i = 0; i < responseJSON['results'].length; i++) {
        const url = responseJSON['results'][i]['url'];
        const responseSinglePokemon = await fetch(url);
        const responseSinglePokemonJSON = await responseSinglePokemon.json();

        // Push all Pokemon in global array - After every recall +offset
        loadedPokemon.push(responseSinglePokemonJSON);
    }

    renderPokemon(loadedPokemon);
}

async function filterPokemon() {
    searchedPokemon = []; // Clear previous search results
    userIsOnHome = false; // Prevent pagination to load more pokemon

    // Get search input from user
    let searchText = document.getElementById('search-input').value.toLowerCase();
    // console.log('Search Text: ', searchText);

    // Clear user input after submit
    document.getElementById('search-input').value = '';

    if (searchText.length >= 3) {
        // Iterate through all Pokemon names and urls
        for (let i = 0; i < allPokemonNamesAndUrl.length; i++) {
            // Check which pokemon name matches search input from user
            if (allPokemonNamesAndUrl[i]['name'].toLowerCase().includes(searchText)) {
                // Fetch searched pokemon
                const url = allPokemonNamesAndUrl[i]['url'];
                const response = await fetch(url);
                const responseJSON = await response.json();

                // Push searched pokemon in extra array
                searchedPokemon.push(responseJSON);
            } else {
                generateEmptyHTML();
            }
        }

        renderPokemon(searchedPokemon);
    } else {
        window.alert('Please enter at least 3 or more characters!')
    }
}

function showLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('d-none');
    document.body.style = 'overflow: hidden';
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.add('d-none');
    document.body.style = 'overflow: auto';
}

// ####################################### MAIN #######################################

function loadMorePokemon() {
    // Check if user is on home. This function should not be called on favorite-site or when pokemon are filtered
    if (userIsOnHome) {
        offset += 25;
        loadPokemonPagination();
    }
}

function saveToLocalStorage() {
    // Deactivated! To save all loaded pokemon in local storage will cause in an error because it's too big data
    // let loadedPokemonAsString = JSON.stringify(loadedPokemon);
    // localStorage.setItem('loadedPokemon', loadedPokemonAsString);

    let favoritePokemonAsString = JSON.stringify(favoritePokemon);
    localStorage.setItem('favoritePokemon', favoritePokemonAsString);
}

function loadFromLocalStorage() {
    // Deactivated! To save all loaded pokemon in local storage will cause in an error because it's too big data
    // let loadedPokemonAsString = localStorage.getItem('loadedPokemon');
    // loadedPokemon = JSON.parse(loadedPokemonAsString) || [];

    let favoritePokemonAsString = localStorage.getItem('favoritePokemon');
    favoritePokemon = JSON.parse(favoritePokemonAsString) || [];
}

function renderPokemon(array) {
    // Get render container and clear it
    let container = document.getElementById('pokedex-render-container');
    container.innerHTML = '';

    // Check if there are any pokemon to display. If not, display a message
    if (array.length < 1) {
        container.innerHTML = generateEmptyHTML();
    }

    // Iterate through all pokemon and generate each of it
    for (let i = 0; i < array.length; i++) {
        container.innerHTML += generatePokedexCardHTML(array, i);
    }
}

function showPokemonDetails(array, index) {
    // Prevent user to scroll when pokemon details are open
    document.body.style.overflow = 'hidden';

    let container = document.getElementById('pokemon-details-container');
    container.classList.remove('d-none');
    container.innerHTML = generatePokemonDetailsCardHTML(array, index);
}

function closePokemonDetails() {
    let container = document.getElementById('pokemon-details-container');
    container.classList.add('d-none');
    container.innerHTML = '';

    document.body.style.overflow = 'auto';
}

function setFavoritePokemon(array, index, pokemonID) { // WIP because pokemonID is not used yet
    // Checks if the property of the current object exists. If not set it to favorite to change it below
    if (array[index]['favorite'] == undefined) {
        array[index]['favorite'] = false;
    }

    // Changes current favorite status false = true / true = false
    array[index]['favorite'] = !array[index]['favorite'];

    // Add Pokemon to favorites 
    if (array[index]['favorite'] == true) {
        document.getElementById(`fav-icon-pokemon-index-${index}`).src = './img/icons/favorite_saved.svg';
        favoritePokemon.push(array[index]);

        // Remove Pokemon from favorites
    } else {
        favoritePokemon.splice(getSavedPokemonIndex(pokemonID), 1);
        closePokemonDetails();

        // To prevent the render of the favorite Pokemon when the user is on home and removes a favorite Pokemon
        if (!userIsOnHome) {
            renderPokemon(favoritePokemon);
        }
    }

    saveToLocalStorage();
}

function getSavedPokemonIndex(pokemonID) {
    for (let i = 0; i < favoritePokemon.length; i++) {
        const pokemon = favoritePokemon[i];

        // Returns the index of the favorite pokemon when the current pokemonID matches the ID in favoritePokemon array
        if (pokemon['id'] == pokemonID) {
            return favoritePokemon.indexOf(favoritePokemon[i]);
        }
    }
}

function home() {
    userIsOnHome = true;

    // Clear searched Pokemon
    searchedPokemon = [];

    renderPokemon(loadedPokemon);
}

function showFavoritePokemon() {
    // Prevent pagination to load more pokemon
    userIsOnHome = false;

    if (favoritePokemon.length > 0) {
        renderPokemon(favoritePokemon);
    } else {
        window.alert('There are no Pokemon to display! Go and catch some you like!');
    }
}

function getArrayNameAsString(array) {
    let arrayNameAsString;

    switch (array) {
        case loadedPokemon:
            arrayNameAsString = 'loadedPokemon';
            break;

        case searchedPokemon:
            arrayNameAsString = 'searchedPokemon';
            break;

        case favoritePokemon:
            arrayNameAsString = 'favoritePokemon';
            break;
    }

    return arrayNameAsString;
}

function capitalize(string) {
    if (string) {
        return string.toUpperCase();
    }
}

function capitalizeFirstLetter(str) {
    return str.replace(/(^|\/|-)(\S)/g, s => s.toUpperCase());
}

function capitalizeAfterHyphen(str) {
    return str.replace(/-([a-z])/g, (_, char) => '-' + char.toUpperCase());
}

// Track scrolling and when user scrolled to bottom of pagination, load more pokemon
window.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 100) { // Add 100px offset for mobile devices
        // console.log('Scrolled to bottom');
        loadMorePokemon();
    }
});

// ####################################### POKEMON PROPERTIES #######################################

function getPokemonProperties(array, index, property) {
    // Useful for all properties in first level of array (Height, weight)
    return array[index][property];
}

function getPokemonID(array, index) {
    return array[index]['id'];
}

function getPokemonName(array, index) {
    let name = array[index]['name'];

    // Returns name and capitalize the first and every letter after - and /
    // https://stackoverflow.com/questions/41490076/capitalize-every-letter-after-and-characters
    return name.replace(/(^|\/|-)(\S)/g, s => s.toUpperCase());
}

function getPokemonImg(array, index) {
    if (array[index]['sprites']['other']['official-artwork']['front_default']) {
        return array[index]['sprites']['other']['official-artwork']['front_default'];
    } else {
        return './img/no_image.svg';
    }
}

function getPokemonType(array, index, typeIndex) {
    // Some pokemon have to types: Type 1 = typeIndex 0, type 2 = typeIndex 1
    if (array[index]['types'][typeIndex]) {
        return array[index]['types'][typeIndex]['type']['name'];
    } else {
        // If there is no type 2, the return sends the class 'd-none' to the class="" of the second type and is not displayed
        return 'd-none';
    }
}

function getPokemonStat(array, index, stat) {
    return array[index]['stats'][stat]['base_stat'];
}

function getPokemonStatPercent(array, index, stat) {
    // There has to be a cap of each stat. After some research, this was the maximum i found
    let maxStat = 255;
    let stats = array[index]['stats'][stat]['base_stat'];

    // Calculate the percentage of each stat in relation to the maximum
    return (stats / maxStat) * 100;
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

function getPokemonAbilities(array, index, abilityIndex) {
    // Some pokemon have more then one ability: Ability 1 = abilityIndex 0, ability 2 = abilityIndex 1 and ability 3 = abilityIndex 2
    if (array[index]['abilities'][abilityIndex]) {
        return array[index]['abilities'][abilityIndex]['ability']['name'].replace(/(^|\/|-)(\S)/g, s => s.toUpperCase());
    } else {
        // If there is no ability, the return sends the class 'd-none' to the class="" and further abilities are not displayed
        return 'd-none';
    }
}

function getPokemonFavoriteState(array, index) {
    if (array[index]['favorite'] == true) {
        return './img/icons/favorite_saved.svg';
    } else {
        return './img/icons/favorite.svg';
    }
}