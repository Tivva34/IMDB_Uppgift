const Api_Key = "301ede5"; // API-nyckel
const Base_URL = "http://www.omdbapi.com/"; // Base URL för OMDB

// Fetch favorite movies from Jesper's API
export function fetchFavoriteMovies() {
    return fetch("https://santosnr6.github.io/Data/favoritemovies.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching favorite movies:", error);
            return []; // Returna en empty array om nått går fel
        });
}

// Fetcha movie details fråm OMDB API
export function fetchMovieDetails(imdbID) {
    return fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=301ede5&plot=full`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "False") {
                throw new Error(`Movie not found: ${data.Error}`);
            }
            return data;
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
            return null; // Return null om error occurs
        });
}

// Search for movies based on a query in OMDB API
export function searchMovies(query) {
    return fetch(`https://www.omdbapi.com/?apikey=301ede5&s=${encodeURIComponent(query)}&page=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "False") {
                console.warn(`No results found for query: "${query}"`);
                return [];
            }
            return data.Search || []; // Return movies if available
        })
        .catch(error => {
            console.error("Error searching for movies:", error);
            return []; /// Returna en empty array om nått går fel
        });
}

// Fetch the top movies list from Jesper's API
export function fetchTopMovies() {
    return fetch("https://santosnr6.github.io/Data/favoritemovies.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                return data; // returna movielist om det är en array
            } else {
                console.warn("No movies found.");
                return [];
            }
        })
        .catch(error => {
            console.error("Error fetching all movies:", error);
            return []; // Returna en empty array om nått går fel
        });
}
