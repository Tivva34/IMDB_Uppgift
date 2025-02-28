// rendera element i en container
export function renderElements(container, elements) {
    if (!container) {
        console.error("Container not found.");
        return;
    }

    // Filtrera bort null eller ogiltiga element innan vi renderar
    const validElements = elements.filter(element => element !== null && element !== undefined);
    // Rensa containern innan nya kort läggs till
    container.innerHTML = ''; // Töm containern
    // Lägg till alla giltiga element i containern
    container.append(...validElements);
}

export function renderMovieDetails(movie) {
    const movieInfoContainer = document.getElementById("movieInformation");
    if (!movieInfoContainer) {
        console.error("Elementet 'movieInformation' saknas.");
        return;
    }
    movieInfoContainer.innerHTML =
        `<h1>${movie.Title}</h1>
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <p>${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Year:</strong> ${movie.Year}</p>`;
}

// Funktion för att hantera sökformuläret
export function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;  // Navigera till sökresultatsidan
            }
        });
    }
}
