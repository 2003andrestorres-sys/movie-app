// Clave y URLs base de la API de TMDB
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // Clave pública de prueba
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=es-ES`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('movies-grid');
const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

// Obtener películas iniciales (Populares)
getMovies(API_URL);

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        showMovies(data.results);
    } catch (error) {
        console.error("Error al obtener las películas:", error);
    }
}

// Renderizar las películas en la pantalla
function showMovies(movies) {
    main.innerHTML = '';

    if (movies.length === 0) {
        main.innerHTML = `<h2 style="grid-column: 1/-1; text-align: center; color: #b3b3b3;">No se encontraron películas.</h2>`;
        return;
    }

    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview, release_date } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

        // Validar si tiene póster o mostrar una imagen por defecto
        const poster = poster_path 
            ? IMG_PATH + poster_path 
            : 'https://via.placeholder.com/500x750?text=Sin+Imagen';

        movieEl.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

// Dar color a la puntuación según la nota
function getClassByRate(vote) {
    if (vote >= 7.5) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Manejar la búsqueda en tiempo real desde el formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
        getMovies(SEARCH_URL + encodeURIComponent(searchTerm));
        searchInput.value = '';
    }
});

// Manejar los botones de filtro rápido
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover clase active de todos y ponerla en el presionado
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const type = btn.getAttribute('data-type');
        let endpoint = `${BASE_URL}/movie/${type}?api_key=${API_KEY}&language=es-ES`;
        
        getMovies(endpoint);
    });
});