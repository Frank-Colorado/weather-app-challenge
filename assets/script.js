// SIDEBAR VARIABLES
const searchInput = document.getElementById("city-input");
// CURRENT WEATHER DISPLAY VARIABLES
const cityName = document.getElementById("city-name");
const date = document.getElementById("date");
const weatherIcon = document.getElementById("weather-type");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

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
    currentWeatherDisplay(data[0]);
    forecastDisplay(data[1]);
  } catch (error) {
    console.log("Error", error);
  }
};

//
const currentWeatherDisplay = (data) => {
  console.log(data);
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
  console.log(data);
};

const displayRecentSearches = () => {
  // This will display recent searches
};

const saveSearchInput = (search, searches) => {
  if (!searches.includes(search)) {
    searches.push(search);
  }
  if (searches.length > 5) {
    searches.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(searches));
  displayRecentSearches(searches);
};

const getSearchInput = () => {
  const newSearch = searchInput.value.toLowerCase();
  getWeatherData(newSearch);
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  saveSearchInput(newSearch, recentSearches);
};

getWeatherData();
