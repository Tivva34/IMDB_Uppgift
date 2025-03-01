console.log("favorites.js är laddad!");

// Funktion för att hämta favoriter från localStorage
function getFavoritesFromStorage() {
    return JSON.parse(localStorage.getItem("favoriteMovies")) || [];
}

// Funktion för att spara uppdaterade favoriter till localStorage
function saveFavoritesToStorage(favorites) {
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
}

// Funktion för att spara eller ta bort film från favoriter
export function saveToFavorites(movieData) {
    let favorites = getFavoritesFromStorage();

    const movieToSave = {
        title: movieData.title,
        year: movieData.year,
        imdbID: movieData.id,
        poster: movieData.poster,
        plot: movieData.plot
    };

    const movieIndex = favorites.findIndex(fav => fav.imdbID === movieToSave.imdbID);
    const favoriteButton = document.querySelector(`#movie-${movieToSave.imdbID} .favorite-button`);

    if (favoriteButton !== null) {
        favoriteButton.textContent = movieIndex === -1 ? "Remove from favorites" : "Add to favorites";
    }

    if (movieIndex === -1) {
        favorites.push(movieToSave);
    } else {
        favorites.splice(movieIndex, 1);
    }

    saveFavoritesToStorage(favorites);
    renderFavorites();
}

// Funktion för att rendera favoriter på sidan
export function renderFavorites() {
    const container = document.getElementById('card-Container');
    if (!container) return;

    container.innerHTML = '';  // Rensa tidigare innehåll

    const favorites = getFavoritesFromStorage();
    if (favorites.length === 0) {
        container.innerHTML = "<p>Inga favoritfilmer än.</p>";
        return;
    }

    favorites.forEach(movieData => {
        const card = createFavoriteCard(movieData);
        container.appendChild(card);
    });

}

// Funktion för att ta bort film från favoriter
export function removeFromFavorites(imdbID) {
    let favorites = getFavoritesFromStorage();
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    saveFavoritesToStorage(favorites);
    renderFavorites();
}

// Funktion för att skapa kort för favoriter
export function createFavoriteCard(movieData) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.setAttribute('data-imdbid', movieData.imdbID);

    card.innerHTML = `
        <img src="${movieData.poster}" alt="${movieData.title}" class="movie-poster">
        <h3>${movieData.title} (${movieData.year})</h3>
        <button class="remove-btn">Ta bort från favoriter</button>
    `;
    // Lägg till eventlyssnare för remove-knappen
    const removeButton = card.querySelector('.remove-btn');
    removeButton.addEventListener('click', () => {
        removeFromFavorites(movieData.imdbID);
    });
    return card;
}

// Rendera favoriter om användaren är på favoritsidan
if (window.location.pathname.includes('favorites.html')) {
    window.onload = renderFavorites;
}

// Uppdatera favoritknappens status beroende på om filmen är i favoriter
export function updateFavoriteButtonStatus(movie) {
    const favoriteButton = document.querySelector(`#movie-${movie.imdbID} .favorite-button`);
    if (favoriteButton) {
        if (isMovieFavorite(movie.imdbID)) {
            favoriteButton.classList.add('filled');
        } else {
            favoriteButton.classList.remove('filled');
        }
    }
}

// Kontrollera om filmen är en favorit
export function isMovieFavorite(imdbID) {
    const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    return favorites.some(movie => movie.imdbID === imdbID);
}


// Kontrollera om filmen är en favorit
export function isMovieFavorite(imdbID) {
    const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    return favorites.some(movie => movie.imdbID === imdbID);
}
