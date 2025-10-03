const apiBase = 'https://swapi.dev/api/people/';
let currentId = 1;

async function fetchCharacter(id) {
        currentId = id;
        window.location.hash = `#${id}`;
    try {
        const res = await fetch(`${apiBase}${id}/`);
        if (!res.ok) throw new Error('Character not found');
        const data = await res.json();

        document.getElementById('name').textContent = data.name;
        document.getElementById('height').textContent = data.height;
        document.getElementById('mass').textContent = data.mass;
        document.getElementById('hair_color').textContent = data.hair_color;
        document.getElementById('skin_color').textContent = data.skin_color;
        document.getElementById('eye_color').textContent = data.eye_color;
        document.getElementById('birth_year').textContent = data.birth_year;
        document.getElementById('gender').textContent = data.gender;

        // Homeworld
        fetch(data.homeworld)
            .then(res => res.json())
            .then(hw => {
                document.getElementById('homeworld').textContent = hw.name;
            })
            .catch(() => document.getElementById('homeworld').textContent = 'Desconegut');

        // Species
        if (data.species.length > 0) {
            fetch(data.species[0])
                .then(res => res.json())
                .then(sp => {
                    document.getElementById('species').textContent = sp.name;
                })
                .catch(() => document.getElementById('species').textContent = 'Desconegut');
        } else {
            document.getElementById('species').textContent = 'Humà';
        }

        // Films
        Promise.all(data.films.map(url => fetch(url).then(res => res.json())))
            .then(films => {
                document.getElementById('films').textContent = films.map(f => f.title).join(', ');
            })
            .catch(() => document.getElementById('films').textContent = '');

        // Vehicles
        Promise.all(data.vehicles.map(url => fetch(url).then(res => res.json())))
            .then(vehicles => {
                document.getElementById('vehicles').textContent = vehicles.map(v => v.name).join(', ');
            })
            .catch(() => document.getElementById('vehicles').textContent = '');

        // Starships
        Promise.all(data.starships.map(url => fetch(url).then(res => res.json())))
            .then(starships => {
                document.getElementById('starships').textContent = starships.map(s => s.name).join(', ');
            })
            .catch(() => document.getElementById('starships').textContent = '');

    } catch (err) {
        document.getElementById('name').textContent = 'Personatge no trobat';
        document.getElementById('height').textContent = '';
        document.getElementById('mass').textContent = '';
        document.getElementById('hair_color').textContent = '';
        document.getElementById('skin_color').textContent = '';
        document.getElementById('eye_color').textContent = '';
        document.getElementById('birth_year').textContent = '';
        document.getElementById('gender').textContent = '';
        document.getElementById('homeworld').textContent = '';
        document.getElementById('species').textContent = '';
        document.getElementById('films').textContent = '';
        document.getElementById('vehicles').textContent = '';
        document.getElementById('starships').textContent = '';
    }
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentId > 1) fetchCharacter(currentId - 1);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentId < 82) fetchCharacter(currentId + 1);
});

window.addEventListener('load', () => {
    const hashId = parseInt(window.location.hash.substring(1));
    if (hashId && hashId >= 1 && hashId <= 82) {
        fetchCharacter(hashId);
    } else {
        fetchCharacter(currentId);
    }
});

window.addEventListener('hashchange', () => {
    const hashId = parseInt(window.location.hash.substring(1));
    if (hashId && hashId >= 1 && hashId <= 82) {
        fetchCharacter(hashId);
    }
});
