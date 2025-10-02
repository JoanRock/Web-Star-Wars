const fetch = require('node-fetch');

async function searchSWAPI(character) {
    const url = "https://swapi.dev/api/people/?search=${character}";
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching SWAPI:', error);
        return [];
    }
}