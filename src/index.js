const filmEndpoints = "http://localhost:3000/films";

document.addEventListener("DOMContentLoaded", () => {
    getMovies();
    document.querySelector("#buy-ticket").addEventListener("click", handleBuyTicket);
});

function getMovies() {
    fetch(filmEndpoints)
    .then(res => res.json())
    .then(movies => {
        movies.forEach(movie => {
            renderMovieList(movie);
        });
        const firstMovie = document.querySelector("#id1");
        if (firstMovie) {
            firstMovie.dispatchEvent(new Event("click"));
        }
    })
    .catch(error => console.error('Error fetching movies:', error));
}

function renderMovieList(movie) {
    const li = document.createElement("li");
    li.textContent = `${movie.title}`;
    li.id = "id" + movie.id;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        handleDeleteMovie(movie.id);
    });
    li.appendChild(deleteButton);

    const ul = document.querySelector("#films");
    ul.appendChild(li);
    li.classList.add("film");
    li.classList.add('item');

    li.addEventListener("click", () => { handleMovieClick(movie) });

    // Add data attribute to store movie ID
    li.dataset.movieId = movie.id;
}

function handleMovieClick(movie) {
    const poster = document.querySelector("img#poster");
    poster.src = movie.poster;
    poster.alt = movie.title;
    const info = document.querySelector("#showing");
    info.querySelector("#title").textContent = movie.title;
    info.querySelector("#runtime").textContent = movie.runtime + " minutes";
    info.querySelector("#film-info").textContent = movie.description;
    info.querySelector("#showtime").textContent = movie.showtime;
    info.querySelector("#ticket-num").textContent = movie.capacity - movie.tickets_sold + " remaining tickets";

    // Store the clicked movie ID
    document.querySelector("#buy-ticket").dataset.movieId = movie.id;
}

function handleBuyTicket(e) {
    // Get the movie ID from the button dataset
    const movieId = document.querySelector("#buy-ticket").dataset.movieId;

    // Get the number of remaining tickets
    const ticketDiv = document.querySelector("#ticket-num");
    let tickets = parseInt(ticketDiv.textContent.split(" ")[0]);

    if (tickets > 0) {
        tickets -= 1;
        ticketDiv.textContent = tickets + " remaining tickets";
    } else {
        alert("Sold out!");
    }

    // Update tickets sold on the server
    updateTicketsSold(movieId, tickets);
}

function handleDeleteMovie(movieId) {
    fetch(`${filmEndpoints}/${movieId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }
    })
    .catch(error => console.error('Error deleting movie:', error));
}

function updateTicketsSold(movieId, tickets) {
    // Implementation to update server with new ticket count
};