const filmAPI = " http://localhost:3000/films";

const moviePoster = el("poster");
const movieTitle = el("title");
const movieRuntime = el("runtime");
const movieInfo = el("film-info");
const movieShowtime = el("showtime");
const filmList  = el("films");

const ticketsRemaining = el("ticket-num");
const buyTicketButton = el("buy-ticket");

let currentFilm = {};


//fetch the first movie
fetch(`${filmAPI}/1`)
    .then(res => res.json())
    .then(renderMovie);

//fetch all movies
fetch (filmAPI)
    .then (res => res.json())
    .then (renderNav);

//render a movie
function renderMovie(movie) {
    currentFilm = movie;
    moviePoster.src = movie.poster;
    movieTitle.textContent = movie.title;
    movieRuntime.textContent = `${movie.runtime} minutes`;
    movieInfo.textContent = movie.description;
    movieShowtime.textContent = movie.showtime;
    ticketsRemaining.textContent = calculateTicketsRemaining(movie);
    console.log (currentFilm);
    updateBuyButton(movie);
}

//render movie title in nav
function renderNav(movies) {
    filmList.innerHTML = '';
    movies.forEach(addMovieTitleToNav);
}

//event listener for the buy ticket button
buyTicketButton.addEventListener('click', handleBuyTicket);

//update the buy button based on number of tickets remaining
function updateBuyButton(movie){
    const remainingTickets = calculateTicketsRemaining(movie);

    if (remainingTickets <= 0) {
        ticketsRemaining.textContent = "0";
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = "Sold Out";
    } else {
        ticketsRemaining.textContent = remainingTickets;
        buyTicketButton.disabled = false;
        buyTicketButton.textContent = "Buy Ticket";
    }
};

//create list items, add movie titles to them, add event listener to change movie info
function addMovieTitleToNav(movie) {
    const filmItem = document.createElement('li');
    filmItem.className =("film item");

    //check calculated tickets remaining; if 0, add class of sold out to movie title
    if (calculateTicketsRemaining(movie) <= 0) {
        filmItem.classList.add("sold-out");
    }
    filmItem.textContent = movie.title;
    filmList.appendChild(filmItem);

    const deleteButton = document.createElement('button');
    deleteButton.className = "delete-button";
    deleteButton.textContent = "X";
    deleteButton.addEventListener('click', () => deleteMovie(movie));
    filmItem.appendChild(deleteButton);
    
    //event handler for nav items to click and display movie info
    filmItem.addEventListener('click', () => renderMovie(movie));
}

//calculate tickets remaining
function calculateTicketsRemaining (movie) {
   return movie.capacity - movie.tickets_sold;
}

//time-saving with el
function el(id) {
    return document.getElementById(id);
}

function handleBuyTicket() {
    buyTicketButton.disabled = true;
    //post request to update tickets sold
    fetch(`${filmAPI}/${currentFilm.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tickets_sold: currentFilm.tickets_sold + 1
        })
    })
    .then(res => res.json())
    .then(updatedMovie => {
        renderMovie(updatedMovie)
        });
}

