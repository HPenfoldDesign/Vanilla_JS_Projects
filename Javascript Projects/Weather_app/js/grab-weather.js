const api = {
  key: "9d300554ba54395e5cbab30419a1dcd9",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults (query) {
  fetch(`${api.base}/weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(displayResults);
}

function displayResults (weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;
  

const weatherFormation = weather_el.innerText;
    
switch(weatherFormation) {
      case 'Clouds':
        document.body.style.backgroundImage = "url('/img/cloudysky.jpg')";
      break;
      case 'Sunny':
        document.body.style.backgroundImage = "url('/img/sunnysky.jpg')";
      break; 
      case 'Clear':
        document.body.style.backgroundImage = "url('/img/sunnysky.jpg')";
      break; 
      case 'Rain':
        document.body.style.backgroundImage = "url('/img/rainyday.jpg')";
      break; 
      case 'Mist':
        document.body.style.backgroundImage = "url('/img/mistyday.jpg')";
      break;
      case 'Snow':
        document.body.style.backgroundImage = "url('/img/snowymountain.jpg')";
      break;
      default:
        document.body.style.backgroundImage = "url('/img/blueskyclouds.jpg')";
      break;   
    }

  let hiLow = document.querySelector('.hi-low');
  hiLow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}


