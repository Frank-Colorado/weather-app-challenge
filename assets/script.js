// SIDEBAR VARIABLES
const searchInput = document.getElementById("city-input");
const searchesList = document.getElementById("recent-searches");
// CURRENT WEATHER DISPLAY VARIABLES
const cityName = document.getElementById("city-name");
const date = document.getElementById("date");
const weatherIcon = document.getElementById("weather-type");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
// FORECAST WEATHER DISPLAY VARIABLES
const forecastDiv = document.getElementById("forecast");

const getApiData = async (URL) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getWeatherData = async (input) => {
  try {
    const city = input || "Los Angeles";
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c6bc260f8c642aa6780da0d9f526c867`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c6bc260f8c642aa6780da0d9f526c867`;
    const data = await Promise.all([
      getApiData(currentWeatherURL),
      getApiData(forecastURL),
    ]);
    //displayRecentSearches();
    currentWeatherDisplay(data[0]);
    forecastDisplay(data[1].list);
  } catch (error) {
    console.log("Error", error);
  }
};

//
const currentWeatherDisplay = (data) => {
  cityName.innerText = data.name;
  date.innerText = new Date(Date.now()).toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  temp.innerText = (data.main.temp - 273.15).toFixed(2);
  humidity.innerText = data.main.humidity;
  wind.innerText = data.wind.speed;
};

const forecastDisplay = (data) => {
  forecastDiv.innerHTML = "";

  const forecast = data.slice(5);

  const forecast5 = forecast.filter((e, i) => i % 8 === 0);

  forecast5.forEach((day) => {
    const dayCard = document.createElement("div");
    dayCard.classList.add("col", "card", "m-4", "shadow-sm", "weather");
    dayCard.innerHTML = `
    <div class="">
    <h4 class="my-0 font-weight-normal">${day.dt_txt} PM</h4>
  </div>
  <div class="card-body">
  <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
    <ul class="list-unstyled mt-3 mb-4">
      <li>Temp: <span id="temp">${(day.main.temp - 273.15).toFixed(
        2
      )}</span> °C</li>
      <li>Humidity: <span id="humidity">${day.main.humidity}</span> %</li>
      <li>Wind: <span id="wind">${day.wind.speed}</span> MPH</li>
    </ul>
  </div>
</div>
    `;
    forecastDiv.appendChild(dayCard);
  });
};

const displayRecentSearches = () => {
  searchesList.innerHTML = "";
  // This will display recent searches
  const searches = JSON.parse(localStorage.getItem("recentSearches"));
  searches.forEach((item) => {
    const newItem = document.createElement("li");
    newItem.id = item;
    newItem.className = "searchItem";
    newItem.innerHTML = item.toUpperCase();
    searchesList.appendChild(newItem);
  });
};

const saveSearchInput = (search, searches) => {
  if (!searches.includes(search)) {
    searches.push(search);
  }

  if (searches.length > 5) {
    searches.shift();
  }
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  return;
};

const getSearchInput = () => {
  const newSearch = searchInput.value.toLowerCase();
  getWeatherData(newSearch);
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  saveSearchInput(newSearch, recentSearches);
  displayRecentSearches();
};

document.addEventListener("click", function (e) {
  const target = e.target.closest(".searchItem");
  if (target) {
    getWeatherData(target.id);
  }
});

getWeatherData();
