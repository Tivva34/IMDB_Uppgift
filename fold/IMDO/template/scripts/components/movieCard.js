import { saveToFavorites } from './favorites.js';


const missingImage = './IMDO/template/res/missing-poster.jpg';  // Backup image

// movie class
export class Movie {
    constructor(data) {
        this.title = data.title;
        this.year = data.year;
        this.imdbID = data.imdbID;
        this.posterUrl = data.Poster;
        this.plot = data.Plot;
    }

    // get movie details
    getTitle() {
        return this.title;
    }

    getYear() {
        return this.year;
    }

    getImdbID() {
        return this.imdbID;
    }

    getPoster() {
        return this.posterUrl;
    }

    getPlot() {
        return this.plot;
    }
}

// movie card function
export function createMovieCard(movieData) {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.id = `movie-${movieData.imdbID}`;

    // Set aria-label 
    card.setAttribute("aria-label", `View details for ${movieData.title}`);

    const posterUrl = movieData.poster || missingImage;

    card.innerHTML = `
        <img src="${posterUrl}" alt="${movieData.title}" class="movie-poster">
        <h3>${movieData.title}</h3>
        <button class="favorite-btn" aria-label="Add ${movieData.title} to favorites"><i class="fa fa-star"></i></button> <!-- Star button -->
    `;

    const favoriteButton = card.querySelector(".favorite-btn");

    // Checka om filmer redan fins i local storage
    const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const isFavorite = favorites.some(fav => fav.imdbID === movieData.imdbID);

    // om filmen är favorit fyll stjärna
    if (isFavorite) {
        favoriteButton.classList.add("filled");
    }

    // Event listener för toggling favorit status
    favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();  // preventa att kortet klickas när man kickar stjärna

        if (favoriteButton.classList.contains("filled")) {
            removeFromFavorites(movieData.imdbID);
            favoriteButton.classList.remove("filled");
        } else {
            saveToFavorites(movieData);
            favoriteButton.classList.add("filled");
        }
    });

    return card;
}

// create favorite card function
function createFavoriteCard(movieData) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.setAttribute('data-imdbid', movieData.imdbID);

    card.innerHTML = `
        <img src="${movieData.poster}" alt="${movieData.title}" class="movie-poster">
        <h3>${movieData.title} (${movieData.year})</h3>
        <button class="remove-btn" aria-label="Remove ${movieData.title} from favorites">Remove from Favorites</button>
    `;
    //ta bort från favoriter
    card.querySelector('.remove-btn').addEventListener('click', () => {
        removeFromFavorites(movieData.imdbID);
        card.remove();  // ta bort kort från sida
        renderFavorites();  // Updatera sida
    });

    return card;
}

// Function to rendera alla favorites på sidan
export async function renderFavorites() {
    const container = document.getElementById('card-Container');
    if (!container) return;

    container.innerHTML = '';  // Clear previous content

    let favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorite movies yet.</p>";
        return;
    }

    favorites.forEach(movieData => {
        const card = createFavoriteCard(movieData);
        container.appendChild(card);
    });
}

// Remove movie from favorites
function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID); // at bort movie efter imdbID
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
}


export function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    favoriteButtons.forEach(button => {
        const movieId = button.closest('.movie-card').id.replace('movie-', '');
        const isFavorite = favorites.some(fav => fav.imdbID === movieId);

        if (isFavorite) {
            button.classList.add("filled");
        } else {
            button.classList.remove("filled");
        }
    });
}

// vänta på DOM innan man laddar
document.addEventListener('DOMContentLoaded', function () {
    updateFavoriteButtons();  // Updatera alla favorite buttons på sidan
});
