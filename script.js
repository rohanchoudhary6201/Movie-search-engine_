const API_KEY = "c6b8759f25b0cc3152d39bd7294046a5";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// HTML Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const trendingMovies = document.getElementById("trendingMovies");
const movieResults = document.getElementById("movieResults");

const popup = document.getElementById("popup");

const popupPoster = document.getElementById("popupPoster");
const popupTitle = document.getElementById("popupTitle");
const popupRating = document.getElementById("popupRating");
const popupRelease = document.getElementById("popupRelease");
const popupOverview = document.getElementById("popupOverview");

const trailerBtn = document.getElementById("trailerBtn");
const downloadBtn = document.getElementById("downloadBtn");

const closePopup = document.getElementById("closePopup");

let currentMovieId = null;
let trailerURL = "";


window.onload = () => {
    getTrendingMovies();
};


searchBtn.addEventListener("click", () => {

    const movie = searchInput.value.trim();

    if (movie !== "") {

        searchMovie(movie);

    }

});


searchInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});



async function getTrendingMovies() {

    trendingMovies.innerHTML = "<h2>Loading...</h2>";

    try {

        const response = await fetch(

            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`

        );

        const data = await response.json();

        displayMovies(data.results, trendingMovies);

    }

    catch {

        trendingMovies.innerHTML =

            "<h2>Unable to load movies.</h2>";

    }

}



async function searchMovie(movie) {

    movieResults.innerHTML = "<h2>Searching...</h2>";

    try {

        const response = await fetch(

            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${movie}`

        );

        const data = await response.json();

        if (data.results.length === 0) {

            movieResults.innerHTML =

                "<h2>No Movies Found.</h2>";

            return;

        }

        displayMovies(data.results, movieResults);

    }

    catch {

        movieResults.innerHTML =

            "<h2>Search Failed.</h2>";

    }

}


function displayMovies(movies, container) {

    container.innerHTML = "";

    movies.forEach(movie => {

        const poster = movie.poster_path
            ? IMAGE_URL + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image";

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `

            <img src="${poster}" alt="${movie.title}">

            <div class="movie-info">

                <h3>${movie.title}</h3>

                <p>⭐ ${movie.vote_average.toFixed(1)}</p>

                <button class="detailsBtn"
                    data-id="${movie.id}">
                    View Details
                </button>

            </div>

        `;

        container.appendChild(card);

    });

    
    const buttons = document.querySelectorAll(".detailsBtn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            getMovieDetails(id);

        });

    });

}



async function getMovieDetails(id) {

    currentMovieId = id;

    try {

        const response = await fetch(

            `${BASE_URL}/movie/${id}?api_key=${API_KEY}`

        );

        const movie = await response.json();

        popupPoster.src = IMAGE_URL + movie.poster_path;

        popupTitle.innerText = movie.title;

        popupRating.innerText =
            "⭐ Rating : " + movie.vote_average;

        popupRelease.innerText =
            "📅 Release : " + movie.release_date;

        popupOverview.innerText =
            movie.overview;

        popup.style.display = "flex";

        getTrailer(id);

    }

    catch {

        alert("Unable to load details.");

    }

}



closePopup.onclick = () => {

    popup.style.display = "none";

}

window.onclick = (e) => {

    if (e.target == popup) {

        popup.style.display = "none";

    }

}


async function getTrailer(id) {

    trailerURL = "";

    try {

        const response = await fetch(

            `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`

        );

        const data = await response.json();

        const trailer = data.results.find(video =>

            video.type === "Trailer" &&
            video.site === "YouTube"

        );

        if (trailer) {

            trailerURL =
                `https://www.youtube.com/watch?v=${trailer.key}`;

        }

    }

    catch {

        console.log("Trailer Not Found");

    }

}



trailerBtn.addEventListener("click", () => {

    if (trailerURL !== "") {

        window.open(trailerURL, "_blank");

    }

    else {

        alert("Trailer not available.");

    }

});



downloadBtn.addEventListener("click", () => {

    alert(
`Movies cannot be downloaded directly from TMDB.

TMDB only provides movie information, posters, ratings, and trailers.

To support downloading, you must use:

• Your own hosted movie files
OR
• A legal movie download service/API

Downloading copyrighted movies automatically is not supported.`
    );

});



async function getSimilarMovies(id) {

    try {

        const response = await fetch(

            `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`

        );

        const data = await response.json();

        console.log("Similar Movies:");

        console.log(data.results);

    }

    catch {

        console.log("Unable to load similar movies.");

    }

}



let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


function toggleFavorite(movie) {

    const index = favorites.findIndex(item => item.id === movie.id);

    if (index === -1) {

        favorites.push(movie);
        alert(movie.title + " added to Favorites ❤️");

    } else {

        favorites.splice(index, 1);
        alert(movie.title + " removed from Favorites");

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


function isFavorite(id) {

    return favorites.some(movie => movie.id === id);

}


function showLoading(container) {

    container.innerHTML = `
        <div class="loading">
            <h2>Loading...</h2>
        </div>
    `;

}

function hideLoading(container) {

    const loading = container.querySelector(".loading");

    if (loading) {

        loading.remove();

    }

}


function clearSearch() {

    searchInput.value = "";

    movieResults.innerHTML = "";

}


document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        popup.style.display = "none";

    }

});


function refreshTrending() {

    getTrendingMovies();

}

console.log("MovieVerse Part 4 Loaded");