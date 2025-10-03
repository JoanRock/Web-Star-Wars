// Variables globales
let currentPage = 1;
let charactersPerPage = 10;
let allCharacters = [];
let search = window.location.hash ? window.location.hash.substring(1) : '';


document.addEventListener("DOMContentLoaded", function () {
    setupEventListeners();
    loadAllCharacters();

    window.addEventListener("hashchange", function () {
        search = window.location.hash ? window.location.hash.substring(1) : '';
        currentPage = 1;
        loadAllCharacters();
    });
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
// Cargar todos los personajes desde la API
async function loadAllCharacters() {
    const charactersList = document.getElementById("charactersList");
    charactersList.innerHTML = '<div class="loading">Cargando personajes...</div>';

    try {
        let allData = [];
        let nextUrl = `https://swapi.dev/api/people/?search=${search}`;

        // Cache para especies (para no pedir lo mismo varias veces)
        const speciesCache = {};

        while (nextUrl) {
            const response = await fetch(nextUrl);
            if (!response.ok) throw new Error("Error en la API");

            const data = await response.json();

            // Procesar cada personaje del resultado
            for (const character of data.results) {
                let speciesName = "Humano";

                if (character.species && character.species.length > 0) {
                    const speciesUrl = character.species[0];

                    if (speciesCache[speciesUrl]) {
                        speciesName = speciesCache[speciesUrl];
                    } else {
                        try {
                            const speciesResponse = await fetch(speciesUrl);
                            if (speciesResponse.ok) {
                                const speciesData = await speciesResponse.json();
                                speciesName = speciesData.name;
                                speciesCache[speciesUrl] = speciesName;
                            }
                        } catch (e) {
                            console.warn("Error obteniendo especie:", e);
                        }
                    }
                }

                // Extraer ID del personaje
                const id = extractIdFromUrl(character.url);

                allData.push({
                    id: id,
                    name: character.name,
                    species: speciesName,
                    birthYear: character.birth_year
                });
            }

            nextUrl = data.next; // siguiente página
        }

        allCharacters = allData;
        displayCharacters();
    } catch (error) {
        console.error("Error cargando personajes:", error);
        charactersList.innerHTML = '<div class="error">Error cargando los personajes. Intenta nuevamente.</div>';
    }
}

// Obtener todos los IDs de personajes disponibles
// Extraer ID de la URL del personaje
function extractIdFromUrl(url) {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1]) : null;
}

// Obtener información de un personaje (solo nombre, edad y especie)

// Mostrar personajes en la página actual
function displayCharacters() {
    const charactersList = document.getElementById("charactersList");
    const statsElement = document.getElementById("stats");

    if (allCharacters.length === 0) {
        charactersList.innerHTML = '<div class="error">No se ha encontrado ningun personaje.</div>';
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
                <a href="../people/index.html#${character.id}/" class="character-link">
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