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

// This is an asynchronous function called 'getApiData'
// This function has 1 parameter called 'URL'
// This function will be called by the 'getWeatherData' function
const getApiData = async (URL) => {
  // A try...catch block is used to catch any errors
  // This article about handling errors with the fetch API was used as a reference when creating this function: https://ilikekillnerds.com/2023/02/handling-errors-with-the-fetch-api/
  try {
    // fetch is passed the URL paramater
    // The await keyword is used in order to wait for a response from fetch
    // Once a response is recieved, the value is stored in the 'response' variable
    const response = await fetch(URL);
    // Using an if statement, we check to see if the response is ok
    // if its not, then we throw a new Error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Otherwise, the response is then changed to json format
    // once finished, the value is stored in the 'data' variable
    const data = await response.json();
    // The data is then returned
    return data;
  } catch (error) {
    console.error(error);
  }
};

// This is an asynchronous function called 'getWeatherData'
// This function has 1 parameter called 'input'
// This function will be called by the 'getSearchInput' function
const getWeatherData = async (input) => {
  // A try...catch block is used to catch any errors
  try {
    // The 'city' variable is created
    // If there is no value for 'input' then 'Los Angeles' is the default value for 'city'
    // This OR statement was created so that on an initial load of the app, some data would always be displayed on the screen
    const city = input || "Los Angeles";
    // URL variables for both getting the current weather and future forecast are created
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c6bc260f8c642aa6780da0d9f526c867`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c6bc260f8c642aa6780da0d9f526c867`;
    // The Promise.all method is used so that 2 api calls can be made at the same time
    // Promise.all calls getApiData with a different URL, and once both calls are finished, an array is created
    // await is used so that we wait for Promise.all to finish
    // Then the array is stored in the variable 'data'
    const data = await Promise.all([
      getApiData(currentWeatherURL),
      getApiData(forecastURL),
    ]);
    // The function 'CurrentWeatherDisplay' is then called and passed the 0 index of the array data
    currentWeatherDisplay(data[0]);
    // The function 'forecastDisplay' is then called and passed the 'list' key of the 1st index of the array data
    forecastDisplay(data[1].list);
  } catch (error) {
    console.log("Error", error);
  }
};

// This is a function called 'currentWeatherDisplay'
// This function has 1 parameter called 'data'
// This function will be called by the 'getWeatherData' function
const currentWeatherDisplay = (data) => {
  // The inner text of all the elements in the Current Weather Card are set using the values in data
  cityName.innerText = data.name;
  // This article on formatting dates was used when setting the date inner text: https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/
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

// This is a function called 'forecastDisplay'
// This function has 1 parameter called 'data'
// This function will be called by the 'getWeatherData' function
const forecastDisplay = (data) => {
  // The inner HTML of 'forecastDiv' is cleared
  forecastDiv.innerHTML = "";
  // The .slice() method is used to create a new array from the 'data' array starting from the 5th index
  // This new array is stored in the variable 'newData'
  // This documentation on mozilla was used as a reference for this line of code: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  const newData = data.slice(5);
  // The .filter() method is used to create a new from the 'newData' array with only every 8th item
  // This is so that we can get the weather data for 12:00 PM for each of the upcoming 5 days
  // This new array is stored in the variable 'forecast'
  // This w3resource exercise was used as a reference for this line of code: https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-21.php
  const forecast = newData.filter((e, i) => i % 8 === 0);
  // The .forEach() method is used on the array 'forecast'
  forecast.forEach((day) => {
    // For each day, a new card will be created that displays that day's date, weather icon, temperature, humidity, and wind speed
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
    // The new card is then appended to the 'forcastDiv'
    forecastDiv.appendChild(dayCard);
  });
};

// This is a function called 'displayRecentSearches'
// This function has 0 parameters
// This function will be called by the 'getSearchInput' function
const displayRecentSearches = () => {
  // The inner HTML of the search list is cleared
  searchesList.innerHTML = "";
  // The item 'recentSearches' is retrieved from local storage
  // It is then stored in the variable 'searches'
  const searches = JSON.parse(localStorage.getItem("recentSearches"));
  // The .forEach() method is used on 'searches'
  searches.forEach((item) => {
    // For each item, a new list element will be created that displays a previous search by the user
    const newItem = document.createElement("li");
    // The id of this list element is the item itself
    // This id is created so that we can pass it to the API to retrieve weather data
    newItem.id = item;
    newItem.className = "searchItem";
    newItem.innerHTML = item;
    // The new list element is then appended to the 'searcheslist'
    searchesList.appendChild(newItem);
  });
};

// This is a function called 'saveSearchInput'
// This function has 2 parameters called 'search' and 'searches'
// This function will be called by the 'getSearchInput' function
const saveSearchInput = (search, searches) => {
  // If the user's search is blank, then return
  if (search === "") {
    return;
  }
  // If the array 'searches' does NOT already include the value of search
  // This blog Post was used as a reference when creating this if statement: https://bobbyhadz.com/blog/javascript-prevent-adding-duplicates-array
  if (!searches.includes(search)) {
    // then add that search to the 'searches' array
    searches.push(search);
  }

  // If the length of the 'searches' array is grater than 5
  if (searches.length > 5) {
    // Then the first item in the array is removed
    searches.shift();
  }
  // The 'searches' array is then set in local storage under the name 'recentSearches'
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  // then return
  return;
};

// This is a function called 'getSearchInput'
// This function has 0 parameters
// This function will be called when the 'search-btn' is clicked
const getSearchInput = () => {
  // The value of the 'searchInput' field is set to all uppercase letters
  // This is so that regardless of the users capitalization, no repeat searches will be added to the searches list
  // The value is then stored in the variable 'newSearch'
  const newSearch = searchInput.value.toUpperCase();
  // The function 'getWeatherData' is called and passed 'newSearch'
  getWeatherData(newSearch);
  // An OR conditional is used
  // If the item 'recentSearches' exists in local storage then that will be the value of the variable 'recentSearches'
  // Otherwise, the value of 'recentSearches' is an empty array
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  // The function 'saveSearchInput' is then called and passed the variable 'newSearch 'and the array 'recentSearches'
  saveSearchInput(newSearch, recentSearches);
  // The function 'displayRecentSearches' is called
  displayRecentSearches();
};

// This stackoverflow post was used as a reference when creating this addEventListener code block: https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript
// A click event listener is added to the document
document.addEventListener("click", function (e) {
  // If the target of this click was close to an element with the class 'searchItem'
  const target = e.target.closest(".searchItem");
  if (target) {
    // Then the function 'getWeatherData' is called and passed the id of the target clicked
    getWeatherData(target.id);
  }
});

getWeatherData();
