// Importera nödvändiga funktioner och moduler
import { fetchFavoriteMovies, fetchTopMovies, fetchMovieDetails, searchMovies } from "./modules/api.js";
import { createMovieCard } from "./components/movieCard.js";
import { renderElements, renderMovieDetails, initSearchForm } from "./utils/domUtils.js";
import { renderTrailers } from "./modules/caroussel.js";
import { saveToFavorites, updateFavoriteButtonStatus } from "./components/favorites.js";

// Standardbild om ingen affisch finns
const missingImage = './IMDO/template/res/icons/missing-poster.jpg';

// Mappa upp olika funktioner för att initiera sidor beroende på vilken sida användaren är på
const pageInitializers = {
    'index.html': initializeHomePage,
    'favorites.html': initializeFavoritesPage,
    'movie.html': initializeMoviePage,
    'search.html': initializeSearchPage
};

// Hämta aktuell sidnamn
const currentPage = window.location.pathname.split('/').pop();
// Välj funktion för att initialisera baserat på sidnamn
const initializePage = pageInitializers[currentPage];

// Om en funktion finns för aktuell sida, kör den
if (initializePage) {
    initializePage();
} else {
    console.error('Ingen initialiseringsfunktion för denna sida:', currentPage);
}

// Gemensam funktion för att hantera favoritknappar
function handleFavoriteButtonClick(event, movie) {
    event.stopPropagation();  // Hindra att kortet klickas
    saveToFavorites(movie);  // Lägg till film i favoriter
    updateFavoriteButtonStatus(movie);  // Uppdatera knappstatus
}

// Funktion för att lägga till eventlyssnare på favoritknappar
function addFavoriteButtonListener(card, movie) {
    const favoriteButton = card.querySelector(".favorite-button");
    if (favoriteButton && !favoriteButton.hasAttribute('data-listener')) {
        favoriteButton.addEventListener('click', (event) => handleFavoriteButtonClick(event, movie));
        favoriteButton.setAttribute('data-listener', 'true');  // Förhindra duplicerade lyssnare
    }
}

// Initiera startsidan med data
async function initializeHomePage() {
    try {
        // Hämta favoritfilmer och rendera trailers
        const favoriteMovies = await fetchFavoriteMovies();
        if (favoriteMovies && favoriteMovies.length > 0) {
            // Shuffle (blanda) filmerna slumpmässigt
            const shuffledMovies = favoriteMovies.sort(() => Math.random() - 0.5);

            // Ta de 5 första från den slumpade listan
            shuffledMovies.slice(0, 5).forEach((movie, index) => {
                renderTrailers(movie, index + 1);  // Visa trailers för de slumpmässiga filmerna
            });
        }
    } catch (error) {
        console.error("Misslyckades med att hämta favoritfilmer:", error);
    }

    try {
        // Hämta topplistor med filmer och rendera filmkort
        const topMovies = await fetchTopMovies();
        if (topMovies.length > 0) {
            const container = document.getElementById("movie-cards-container");
            if (!container) {
                console.error("Elementet 'movie-cards-container' saknas.");
                return;
            }

            container.innerHTML = '';  // Rensa tidigare innehåll
            topMovies.forEach(movie => {
                if (movie.Title) {
                    const card = createMovieCard({
                        id: movie.imdbID,
                        title: movie.Title,
                        poster: movie.Poster || missingImage  // Om ingen poster, sätt 'missingImage'
                    });

                    // Lägg till en eventlyssnare för att navigera till filmdetaljer
                    card.addEventListener('click', function () {
                        window.location.href = `movie.html?id=${movie.imdbID}`;
                    });

                    if (card) {
                        container.appendChild(card); // Lägg till kortet i containern
                    }

                    // Lägg till favoritknappens funktionalitet
                    addFavoriteButtonListener(card, movie);  // Lägg till lyssnare för favoritknappen
                }
            });
        }
    } catch (error) {
        console.error("Misslyckades med att hämta topplistor av filmer:", error);
    }
}

// Initiera sökresultatsidan
async function initializeSearchPage() {
    const cardContainer = document.getElementById("cardContainer");
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');  // Hämta sökquery från URL

    if (query) {
        document.getElementById("searchInput").value = query;  // Visa sökfrågan i sökfältet
        try {
            const searchResults = await searchMovies(query);
            if (searchResults && searchResults.length > 0) {
                cardContainer.innerHTML = ''; // Rensa tidigare sökresultat
                searchResults.forEach(movie => {
                    if (movie.Title) {
                        const card = createMovieCard({
                            id: movie.imdbID,
                            title: movie.Title,
                            poster: movie.Poster || missingImage  // Om ingen poster, sätt 'missingImage'
                        });

                        // Lägg till en eventlyssnare för att navigera till filmdetaljer
                        card.addEventListener('click', function () {
                            window.location.href = `movie.html?id=${movie.imdbID}`;
                        });

                        cardContainer.appendChild(card);  // Lägg till filmkortet till containern

                        // Lägg till event för favoritknappen
                        addFavoriteButtonListener(card, movie);  // Lägg till lyssnare för favoritknappen
                    }
                });
            } else {
                cardContainer.innerHTML = "<p>Inga resultat hittades för din sökning.</p>";
            }
        } catch (error) {
            console.error("Misslyckades med att hämta sökresultat:", error);
            cardContainer.innerHTML = "<p>Det gick inte att ladda sökresultaten.</p>";
        }
    } else {
        cardContainer.innerHTML = "<p>Ingen sökparameter angiven.</p>";
    }
}

// Initiera filmsidan
async function initializeMoviePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get("id");
    if (!imdbID) {
        console.error("Inget film-ID finns i URL.");
        return;
    }
    try {
        const movieDetails = await fetchMovieDetails(imdbID);
        renderMovieDetails(movieDetails);  // Visa filmens detaljer
    } catch (error) {
        console.error("Misslyckades med att hämta filminformation:", error);
    }
}

// Initiera favoritsidan
function initializeFavoritesPage() {
    const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const cardContainer = document.getElementById("cardContainer");

    if (!cardContainer) {
        console.error("Elementet 'cardContainer' saknas på favoritsidan.");
        return;
    }

    if (favorites.length === 0) {
        cardContainer.innerHTML = "<p>Du har inga favoritfilmer än.</p>";
        return;
    }

    // Skapa och rendera filmkort för favoriter
    const movieCards = favorites.map(movie => {
        if (movie.title) {
            const card = createMovieCard({
                id: movie.imdbID,
                title: movie.title,
                poster: movie.poster || missingImage  // Om ingen poster, sätt 'missingImage'
            });

            card.addEventListener('click', function () {
                window.location.href = `movie.html?id=${movie.imdbID}`;
            });

            return card;
        }
    }).filter(card => card !== undefined);

    renderElements(cardContainer, movieCards);  // Rendera alla favoritkort
}

// Vänta på att DOM ska laddas innan funktioner anropas
document.addEventListener('DOMContentLoaded', function () {
    initSearchForm();  // Anropar den importerade funktionen
});
