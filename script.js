//You can edit ALL of the code here
const searchBox = document.getElementById("search");
const episodesDropdown = document.getElementById("episodeList");
const MoviesDropdown = document.getElementById("allMovies");
let allEpisodes = null;
let allMovies = null;

function setup() {
  allMovies = getAllShows();
  const sortedAllShows = allMovies.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
  });
  createShowsDropdownOptions(sortedAllShows);
  populateCards(sortedAllShows, "show");
}

function getEpisodes(movieId) {
  const endpoint = `https://api.tvmaze.com/shows/${movieId}/episodes`;
  return fetch(endpoint).then((response) => response.json());
}

searchBox.addEventListener("input", (element) => {
  let searchPhrase = element.target.value.toLowerCase();
  let searchResult = search(searchPhrase, allEpisodes);
  populateCards(searchResult);
  displayCount(searchResult);
});

function search(letter, episodes) {
  const filteredEpisodes = episodes.filter((episode) => {
    const { name, summary } = episode;
    return (
      name.toLowerCase().includes(letter) ||
      summary.toLowerCase().includes(letter)
    );
  });
  return filteredEpisodes;
}

function displayCount(searchedEpisodes) {
  const displayCountEl = document.getElementById("search-count");
  const totalEpisodesLength = allEpisodes.length;
  const searchedEpisodesLength = searchedEpisodes.length;
  displayCountEl.innerText = `Displaying ${searchedEpisodesLength}/${totalEpisodesLength} episodes`;
}

function removeDisplayCount() {
  const displayCountEl = document.getElementById("search-count");
  displayCountEl.innerText = "";
}

function concatenateSeasonsAndNumbers(episode) {
  const { season, number } = episode;
  let result = "";
  result += season < 10 ? `S0${season}` : `S${season}`;
  result += number < 10 ? `E0${number}` : `E${number}`;
  return result;
}

function createOptionForMovieList(episode) {
  const option = document.createElement("option");
  option.setAttribute("value", episode.id);
  option.innerText = episode.name;
  return option;
}

function createShowsDropdownOptions(allEpisodes) {
  MoviesDropdown.appendChild(
    createOptionForMovieList({ name: "all shows", id: "all" })
  );
  allEpisodes.forEach((episode) => {
    const option = createOptionForMovieList(episode);
    MoviesDropdown.appendChild(option);
  });
}

MoviesDropdown.addEventListener("change", (element) => {
  let movieId = element.target.value;

  if (movieId === "all") {
    populateCards(allMovies, "show");
    removeDisplayCount();
    makeEpisodeList([]);
  } else {
    getEpisodes(movieId).then((data) => {
      allEpisodes = data;
      populateCards(allEpisodes);

      displayCount(allEpisodes);
      makeEpisodeList(allEpisodes);
    });
  }
});

function createOption(episode) {
  const option = document.createElement("option");
  option.setAttribute("value", episode.id);
  let title = concatenateSeasonsAndNumbers(episode);
  option.innerText = title + `-${episode.name}`;
  return option;
}

function makeEpisodeList(allEpisodes) {
  episodesDropdown.innerHTML = "";
  allEpisodes.forEach((episode) => {
    const option = createOption(episode);
    episodesDropdown.appendChild(option);
  });
}

episodesDropdown.addEventListener("change", (element) => {
  let value = element.target.value;
  console.log(value);

  location.href = `#${value}`;
  let selectedCard = document.getElementById(value);
  selectedCard.classList.add("card--active");
  setTimeout(() => {
    selectedCard.classList.remove("card--active");
  }, 3000);
});

function createCard(episode, type) {
  const li = document.createElement("li");
  const cardTitleWrapper = document.createElement("div");
  const episodeTitle = document.createElement("p");
  const image = document.createElement("img");
  const description = document.createElement("p");
  const link = document.createElement("a");

  li.setAttribute("class", "card");
  cardTitleWrapper.setAttribute("class", "card-title-wrapper");

  episodeTitle.setAttribute("class", "episode-title");

  li.setAttribute("id", episode.id);
  if (type !== "show") {
    let title = concatenateSeasonsAndNumbers(episode);
    episodeTitle.innerText = episode.name + "-" + title;
  } else {
    episodeTitle.innerText = episode.name;
  }

  image.setAttribute("class", "card-img");
  image.setAttribute("src", episode.image ? episode.image.medium : "");

  description.setAttribute("class", "card-desc");
  description.innerHTML = episode.summary;

  link.setAttribute("class", "imageLink");
  link.href = episode.url;
  link.innerText = "click on me";

  cardTitleWrapper.appendChild(episodeTitle);
  li.appendChild(cardTitleWrapper);
  li.appendChild(image);
  li.appendChild(description);
  li.appendChild(link);
  return li;
}

function clearCards(ul) {
  ul.innerHTML = "";
}

function populateCards(episodeList, type) {
  const ul = document.getElementById("cards");
  clearCards(ul);
  episodeList.forEach((episode) => {
    const li = createCard(episode, type);
    ul.appendChild(li);
  });
}

window.onload = setup;
