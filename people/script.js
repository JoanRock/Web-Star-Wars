// Array con los IDs de los personajes que queremos mostrar
const characterIds = [1, 2, 3, 4, 5, 10, 13, 14, 16, 20];

// Función principal que se ejecuta cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    loadCharacters();
});

// Función para cargar todos los personajes
async function loadCharacters() {
    const charactersList = document.getElementById('charactersList');
    charactersList.innerHTML = '<div class="loading">Cargando personajes...</div>';

    try {
        // Crear un array de promesas para cargar todos los personajes
        const characterPromises = characterIds.map(id => getCharacterInfo(id));
        
        // Esperar a que todas las promesas se resuelvan
        const characters = await Promise.all(characterPromises);
        
        // Mostrar los personajes en la página
        displayCharacters(characters);
    } catch (error) {
        console.error('Error cargando personajes:', error);
        charactersList.innerHTML = '<div class="error">Error cargando los personajes. Intenta nuevamente.</div>';
    }
}

// Función para obtener la información de un personaje específico
async function getCharacterInfo(characterId) {
    try {
        // Obtener datos del personaje
        const response = await fetch(`https://swapi.dev/api/people/${characterId}/`);
        const characterData = await response.json();
        
        // Obtener la especie del personaje
        let speciesName = 'Humano'; // Valor por defecto
        if (characterData.species && characterData.species.length > 0) {
            const speciesResponse = await fetch(characterData.species[0]);
            const speciesData = await speciesResponse.json();
            speciesName = speciesData.name;
        }
        
        return {
            name: characterData.name,
            species: speciesName,
            birthYear: characterData.birth_year
        };
    } catch (error) {
        console.error(`Error cargando personaje ${characterId}:`, error);
        return {
            name: `Personaje ${characterId}`,
            species: 'Desconocida',
            birthYear: 'Desconocido',
            error: true
        };
    }
}

// Función para mostrar los personajes en la página
function displayCharacters(characters) {
    const charactersList = document.getElementById('charactersList');
    
    if (characters.length === 0) {
        charactersList.innerHTML = '<div class="error">No se pudieron cargar los personajes.</div>';
        return;
    }
    
    let html = '';
    
    characters.forEach(character => {
        html += `
            <div class="character">
                <h3 href="https://swapi.dev/api/people/${character.characterId}/">${character.name}</h3>
                <p><strong>Especie:</strong> ${character.species}</p>
                <p><strong>Año de nacimiento:</strong> ${character.birthYear}</p>
            </div>
        `;
    });
    
    charactersList.innerHTML = html;
}
