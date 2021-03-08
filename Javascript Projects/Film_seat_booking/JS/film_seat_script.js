const filmSeatScript = (function () {
  const container = document.querySelector(".container");
  const seats = document.querySelectorAll(".row .seat:not(occupied) "); //selects the not occupied seats like in the css.
  const count = document.querySelector("#count");
  const total = document.querySelector("#total");
  const movieSelect = document.querySelector("#movie");

  populateUI();

  let ticketPrice = parseInt(movieSelect.value);

  function setMovieData(filmIndex, filmPrice) {
    localStorage.setItem("selectedFilmIndex", filmIndex);
    localStorage.setItem("selectedFilmPrice", filmPrice);
  }

  function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");

    //selectedSeats turns into an array and maps it to the total number of seats to give you a count of 1,2,3,4 etc depending on how many you select.
    const seatsIndex = [...selectedSeats].map((seat) => {
      return [...seats].indexOf(seat);
    });

    //local storage takes a key value pair and only saves strings. so stringify converts node list to a string. saves in local storage.
    localStorage.setItem("seatsSelectedInBrowser", JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
  }

  //get seat selection data from local starage and populate UI

  function populateUI() {
    //converts back to node list.
    const getSeatsSelected = JSON.parse(
      localStorage.getItem("seatsSelectedInBrowser")
    );

    if (getSeatsSelected !== null && getSeatsSelected.length > 0) {
      seats.forEach((seat, index) => {
        if (getSeatsSelected.indexOf(index) > -1) {
          seat.classList.add("selected");
        }
      });
    }

    //gets the selected film from the UI
    const getSelectedFilmIndex = localStorage.getItem("selectedFilmIndex");

    if (getSelectedFilmIndex !== null) {
      movieSelect.selectedIndex = getSelectedFilmIndex;
    }
  }

  //movie changes price adjusts accordingly.
  movieSelect.addEventListener("change", (event) => {
    ticketPrice = parseInt(event.target.value);
    setMovieData(event.target.selectedIndex, event.target.value);
    updateSelectedCount();
  });

  //seat click event
  container.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("seat") &&
      !event.target.classList.contains("occupied")
    ) {
      event.target.classList.toggle("selected");

      updateSelectedCount();
    }
  });

  //runs this function on page load allowing number of seats and price to be updated.
  updateSelectedCount();
})();
