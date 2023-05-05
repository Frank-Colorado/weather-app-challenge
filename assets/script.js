// SIDEBAR VARIABLES
const searchInput = document.getElementById("city-input");
// CURRENT WEATHER DISPLAY VARIABLES
const cityName = document.getElementById("city-name");
const date = document.getElementById("date");
const weatherIcon = document.getElementById("weather-type");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const getWeatherData = async () => {
  try {
    const city = searchInput.value || "Los Angeles";
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c6bc260f8c642aa6780da0d9f526c867`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c6bc260f8c642aa6780da0d9f526c867`;
    const data = await Promise.all([
      getApiData(currentWeatherURL),
      getApiData(forecastURL),
    ]);
    console.log(data);
    // currentWeatherDisplay(data);
  } catch (error) {
    console.log("Error", error);
  }
};

//
const currentWeatherDisplay = (data) => {
  cityName.innerText = data.name;
};
getWeatherData();
