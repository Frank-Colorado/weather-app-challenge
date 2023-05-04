// API KEY VARIABLE
const API_KEY = "c6bc260f8c642aa6780da0d9f526c867";
// SIDEBAR VARIABLES
const searchInput = document.getElementById("city-input");
// CURRENT WEATHER DISPLAY VARIABLES
const cityName = getElementById("city-name");
const date = getElementById("date");
const weatherIcon = getElementById("weather-type");
const temp = getElementById("temp");
const humidity = getElementById("humidity");
const wind = getElementById("wind");

const getWeatherData = async () => {
  try {
    const city = searchInput.value || "Los Angeles";

    const currentWeather = new Promise(async (resolve, reject) => {
      try {
        const weatherApiData = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        resolve(await weatherApiData.json());
      } catch (err) {
        reject();
      }
    });

    const data = await currentWeather;
    currentWeatherDisplay(data);
  } catch (err) {
    console.log("Error", err);
  }
};

getWeatherData();

//`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
