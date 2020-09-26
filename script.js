let output = document.querySelector(`#current-time`);

let today = new Date();

let date = today.getDate();
let hours = addZero(today.getHours());
let minutes = addZero(today.getMinutes());

let current_time = `Today is the ${date}, at
         ${hours}:${minutes}.`;
output.innerHTML = current_time;

function formatHours(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

function updateMessage(temperature) {
  let cool = `Cool outside. Don't Forget to put on a sweater! 🧥`;
  let warm = `Warm outside. Don't forget a hat! 🧢`;
  let hot = `Hot outside. Don't forget to put on some sunscreen! 🧴`;
  let cold = `Cold outside. Don't forget to put on a scarf! 🧣`;
  let message = "";

  if (temperature > 5 && temperature < 60) {
    message = `${cool}`;
  } else if (temperature >= 60 && temperature < 70) {
    message = `${warm}`;
  } else if (temperature >= 70) {
    message = `${hot}`;
  } else if (temperature < 40) {
    message = `${cold}`;
  }

  return message;
}

function search(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city");
  let cityInput = document.querySelector("#city-input");
  cityElement.innerHTML = cityInput.value;
  searchCity(cityInput.value);
}
function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

function showTemperature(response) {
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#current-temperature");
  let messageOutput = document.querySelector(`.sunny`);
  let temperature = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = temperature;
  messageOutput.innerHTML = updateMessage(temperature);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let forecast = response.data.list[i];

    forecastElement.innerHTML += `
    <div class="col five">
          <div class="card-body">
            <h5 class="card-title">${formatHours(forecast.dt * 1000)}</h5>
            <img
              src="http://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }@2x.png"
              class="card-img-top"
              alt="weather"
            />
            <p class="card-text five"><span class="forecast-min">${Math.round(
              forecast.main.temp_min
            )}</span>˚ - <span class="forecast-max">${Math.round(
      forecast.main.temp_max
    )}</span>˚</p>
          </div>
        </div>
    `;
  }
}

searchCity("New York");
function searchCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}
let currentButton = document.querySelector("#current-location-button");
currentButton.addEventListener("click", getCurrentLocation);
