const mainContent = document.getElementById("main-content")
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
let myMovieWatchlistArray = []

/* --- event listener --- */
document.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        console.log(e.target.dataset.id)
        const specificID = e.target.dataset.id
        
        if (watchlist.includes(specificID)) {
            watchlist = watchlist.filter(id => id !== specificID) // remove that specificID from watchlist
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
            myMovieWatchlistArray = myMovieWatchlistArray.filter(movie => movie.imdbID !== specificID) // Update myMovieWatchlistArray to reflect the changes
            renderMovies(myMovieWatchlistArray)
        }

        if (watchlist.length === 0) {
            renderEmptyWatchlistState()
        }
    }
})

renderWatchlist()


/* --- function --- */
async function renderWatchlist() {
    try {
        const promises = watchlist.map(async id => {
            try {
                const res = await fetch(`https://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
                const data = await res.json()
                myMovieWatchlistArray.push(data)
            }
            catch {
                console.error('Error fetching movie data:', error)
            }
        })
        await Promise.all(promises)

        console.log(myMovieWatchlistArray)
        if (watchlist.length === 0) {
            renderEmptyWatchlistState()
        } else {
            renderMovies(myMovieWatchlistArray)
        }
    } 
    catch (error) {
        console.error('Error rendering movies:', error)
    }
}

// const promises = watchlist.map(id => {
//     return fetch(`https://www.omdbapi.com/?apikey=98bd65f&i=${id}`)
//         .then(res => res.json())
//         .then(data => {
//             myMovieWatchlistArray.push(data)
//         })
//         .catch(error => console.error('Error fetching movie data:', error))
// })

// Promise.all(promises)
//     .then(() => {
//         console.log(myMovieWatchlistArray)
//         if (watchlist.length === 0) {
//             renderEmptyWatchlistState()
//         } else {
//             renderMovies(myMovieWatchlistArray)
//         }
        
//     })
//     .catch(error => console.error('Error rendering movies:', error))


function renderMovies(myMovies) {
    const myMoviesList = myMovies.map(movie => {
        return `
            <div class="movie flex">
                <img src="${movie.Poster}" alt="poster of the movie" class="movie-img"/>
                <div class="movie-desc">
                    <div class="desc-top flex">
                        <h2>${movie.Title}</h2>
                        <p class="rating">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="desc-mid flex">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <div id="add-to-watchlist" class="remove-from-watchlist flex">
                            <i id="icon" class="fa-solid fa-circle-minus" data-id="${movie.imdbID}"></i>
                            <p id="watchlist-text" data-id="${movie.imdbID}">Remove</p>
                        </div>
                    </div>
                    <div class="desc-bottom flex">
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
            </div>
        `
    }).join('')

    mainContent.innerHTML = myMoviesList
}

function renderEmptyWatchlistState() {
    mainContent.innerHTML = `
        <div class="initial-state flex">
            <p class="default-text">Your watchlist is looking a little empty...</p>
            <a href="index.html" class="add-some-movies flex">
                <i class="fa-solid fa-circle-plus"></i>
                <span class="recommendation">Let's add some movies!</span>
            </a>
        </div>
    `
}

