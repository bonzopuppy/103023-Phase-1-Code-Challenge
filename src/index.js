// Your code here
const filmAPI = " http://localhost:3000/films";

const moviePoster = el("poster");
const movieTitle = el("title");
const movieRuntime = el("runtime");
const movieInfo = el("film-info");
const movieShowtime = el("showtime");
const filmList  = el("films");

const ticketsRemaining = el("ticket-num");
const buyTicketButton = el("buy-ticket");

let currentFilm;

//event listener for the buy ticket button
buyTicketButton.addEventListener('click', () => sellTicket(currentFilm));


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
    ticketsRemaining.textContent = movie.capacity - movie.tickets_sold;
  
    updateBuyButton(movie);
}

//update the buy button based on number of tickets remaining
function updateBuyButton(movie){
    const remainingTickets = movie.capacity - movie.tickets_sold;

    if (remainingTickets <= 0) {
        ticketsRemaining.textContent = "0";
        buyTicketButton.disabled = true;
    } else {
        ticketsRemaining.textContent = remainingTickets;
        buyTicketButton.disabled = false;
    }
};

//render movie title in nav
function renderNav(movies) {
    filmList.innerHTML = '';
    movies.forEach(addMovieTitleToNav);
}

//create list items, add movie titles to them, add event listener to change movie info
function addMovieTitleToNav(movie) {
    const filmItem = document.createElement('li');
    filmItem.className = "film item";
    filmItem.textContent = movie.title;
    filmList.appendChild(filmItem);
    //event handler for nav items to click and display movie info
    filmItem.addEventListener('click', () => renderMovie(movie));
}

//update number of tickets sold
function sellTicket (currentFilm) {
    //Check tickets left to sell
    if(currentFilm.capacity - currentFilm.tickets_sold > 0) {
        //increment number of ticket sold
        currentFilm.tickets_sold += 1;
        //udate the remaining tickets on frontend
        updateBuyButton(currentFilm);
    } else {
        //disable the buy ticket button since the movie is sold out
        buyTicketButton.disabled = true;
    }    
}

//time-saving with el function!
function el(id) {
    return document.getElementById(id);
}
