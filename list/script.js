// Variables globales
let currentPage = 1;
let charactersPerPage = 10;
let allCharacters = [];

// Inicializar cuando la página carga
document.addEventListener("DOMContentLoaded", function () {
    setupEventListeners();
    loadAllCharacters();
});

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('charactersPerPage').addEventListener('change', function() {
        charactersPerPage = parseInt(this.value);
        currentPage = 1;
        displayCharacters();
    });
    
    document.getElementById('firstPage').addEventListener('click', goToFirstPage);
    document.getElementById('prevPage').addEventListener('click', goToPrevPage);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);
    document.getElementById('lastPage').addEventListener('click', goToLastPage);
}

// Funciones de navegación
function goToFirstPage() {
    currentPage = 1;
    displayCharacters();
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayCharacters();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(allCharacters.length / charactersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayCharacters();
    }
}

function goToLastPage() {
    currentPage = Math.ceil(allCharacters.length / charactersPerPage);
    displayCharacters();
}

// Cargar todos los personajes desde la API
async function loadAllCharacters() {
    const charactersList = document.getElementById("charactersList");
    charactersList.innerHTML = '<div class="loading">Cargando personajes...</div>';

    try {
        const characterIds = await getAllCharacterIds();
        const characterPromises = characterIds.map(id => getCharacterInfo(id));
        allCharacters = await Promise.all(characterPromises);
        displayCharacters();
    } catch (error) {
        console.error("Error cargando personajes:", error);
        charactersList.innerHTML = '<div class="error">Error cargando los personajes. Intenta nuevamente.</div>';
    }
}

// Obtener todos los IDs de personajes disponibles
async function getAllCharacterIds() {
    let characterIds = [];
    let nextUrl = 'https://swapi.dev/api/people/';
    
    try {
        while (nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            
            data.results.forEach(character => {
                const id = extractIdFromUrl(character.url);
                if (id) characterIds.push(id);
            });
            
            nextUrl = data.next;
        }
        
        return characterIds;
    } catch (error) {
        console.error("Error obteniendo IDs de personajes:", error);
        throw error;
    }
}

// Extraer ID de la URL del personaje
function extractIdFromUrl(url) {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1]) : null;
}

// Obtener información de un personaje (solo nombre, edad y especie)
async function getCharacterInfo(characterId) {
    try {
        const response = await fetch(`https://swapi.dev/api/people/${characterId}/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const characterData = await response.json();

        let speciesName = "Humano";
        if (characterData.species && characterData.species.length > 0) {
            try {
                const speciesResponse = await fetch(characterData.species[0]);
                if (speciesResponse.ok) {
                    const speciesData = await speciesResponse.json();
                    speciesName = speciesData.name;
                }
            } catch (speciesError) {
                console.warn(`Error cargando especie para personaje ${characterId}:`, speciesError);
            }
        }

        return {
            id: characterId,
            name: characterData.name,
            species: speciesName,
            birthYear: characterData.birth_year
        };
    } catch (error) {
        console.error(`Error cargando personaje ${characterId}:`, error);
        return {
            id: characterId,
            name: `Personaje ${characterId}`,
            species: "Desconocida",
            birthYear: "Desconocido",
            error: true,
        };
    }
}

// Mostrar personajes en la página actual
function displayCharacters() {
    const charactersList = document.getElementById("charactersList");
    const statsElement = document.getElementById("stats");

    if (allCharacters.length === 0) {
        charactersList.innerHTML = '<div class="error">No se pudieron cargar los personajes.</div>';
        return;
    }

    // Calcular índices para la página actual
    const totalPages = Math.ceil(allCharacters.length / charactersPerPage);
    const startIndex = (currentPage - 1) * charactersPerPage;
    const endIndex = Math.min(startIndex + charactersPerPage, allCharacters.length);
    
    // Actualizar estadísticas
    statsElement.textContent = `Mostrando ${startIndex + 1} - ${endIndex} de ${allCharacters.length} personajes`;

    // Generar HTML para los personajes de la página actual
    let html = "";
    for (let i = startIndex; i < endIndex; i++) {
        const character = allCharacters[i];
        
        if (character.error) {
            html += `
            <div class="character">
                <h3>${character.name}</h3>
                <p><strong>Error:</strong> No se pudo cargar la información</p>
            </div>
            `;
        } else {
            html += `
            <div class="character">
                <a href="https://swapi.dev/api/people/${character.id}/" class="character-link" target="_blank">
                    <h3>${character.name}</h3>
                </a>
                <p><strong>Especie:</strong> ${character.species}</p>
                <p><strong>Año de nacimiento:</strong> ${character.birthYear}</p>
            </div>
            `;
        }
    }

    charactersList.innerHTML = html;
    updatePaginationControls(totalPages);
}

// Actualizar controles de paginación
function updatePaginationControls(totalPages) {
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    
    document.getElementById('firstPage').disabled = currentPage === 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('lastPage').disabled = currentPage === totalPages;
}