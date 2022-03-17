function render() {
    loadAPI();
}

// Get first 20 pokemons from the API
async function loadAPI() {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    const response = await fetch(url);
    responseJSON = await response.json(response);

    console.log('response: ', response)
    console.log('responseJSON: ', responseJSON);
}