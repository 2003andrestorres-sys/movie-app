// Configuración de la API de TMDB
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = 'https://api.themoviedb.org/3';

// Endpoints principales
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=es-ES`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('movies-grid');
const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

// Obtener películas populares al cargar la página
getMovies(API_URL);

async function getMovies(url) {
    try {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        showMovies(data.results);
    } catch (error) {
        console.error("Error al obtener las películas:", error);
        main.innerHTML = `<h2 style="grid-column: 1/-1; text-align: center; color: #e50914;">Error al cargar las películas. Revisa tu conexión.</h2>`;
    }
}

// Renderizar las tarjetas de películas en el DOM
function showMovies(movies) {
    main.innerHTML = '';

    if (!movies || movies.length === 0) {
        main.innerHTML = `<h2 style="grid-column: 1/-1; text-align: center; color: #b3b3b3;">No se encontraron películas.</h2>`;
        return;
    }

    movies.forEach(movie => {
        const { title, poster_path, vote_average } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

        // Imagen de la portada o imagen de reemplazo si no tiene
        const poster = poster_path 
            ? IMG_PATH + poster_path 
            : 'https://via.placeholder.com/500x750?text=Sin+Imagen';

        movieEl.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span>⭐ ${vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

// Búsqueda por formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_URL + encodeURIComponent(searchTerm));
        searchInput.value = '';
    } else {
        getMovies(API_URL);
    }
});

// Filtros de categorías
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const type = btn.getAttribute('data-type');
        let endpoint = `${BASE_URL}/movie/${type}?api_key=${API_KEY}&language=es-ES`;
        
        getMovies(endpoint);
    });
});