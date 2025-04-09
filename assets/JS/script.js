// https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr;

//http://api.weatherstack.com/current?access_key=9eb96fbc693de8930d830f5cef2eb0a4& query=New York
const mainContainer = document.querySelector("#main-container");

const cityName = document.querySelector("#city-name");
const searchBtn = document.querySelector("#search-btn");
const errorMsg = document.querySelector(".error-container");

//fetch the weather data
async function getWeatherData(city) {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/?unitGroup=us&key=JN8U4PCMHTWFHCU6JLYSTHNYC`;

    const url2 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=290cf603e9b9bafeb302e7bd44ef67cb`;


    const res = await fetch(url, { mode: "cors" });
    const res2 = await fetch(url2, { mode: "cors" });

    //for debugging
    console.log(res);
    console.log(res2);


    const weatherData = await res.json();
    const weatherData2 = await res2.json();

    //All the informations of the API
    const localtime = weatherData.days[0].datetime + " " + weatherData.currentConditions.datetime;
    console.log(localtime);
    return {
      address: weatherData.resolvedAddress,
      localtime: localtime,

      temp: `${tempToCelsius(weatherData2.main.temp)} °C`,
      tempMin: `${tempToCelsius(weatherData2.main.temp_min)} °C`,
      tempMax: `${tempToCelsius(weatherData2.main.temp_max)} °C`,
      weatherId: weatherData2.weather[0].id,
      weatherDescription: weatherData2.weather[0].description,
      weatherIconUrl: ` https://openweathermap.org/img/wn/${weatherData2.weather[0].icon}@2x.png`,
      uvIndex: weatherData.currentConditions.uvindex,
      humidity: weatherData.currentConditions.humidity,
      sunrise: weatherData.currentConditions.sunrise,
      sunset: weatherData.currentConditions.sunset,
      pressure: weatherData2.main.pressure,
      windSpeed: weatherData2.wind.speed,
    };
  } catch (error) {
    displayError(error.message);
  }
}

// button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cityName.value) {
    renderNext5Forecast(cityName.value);
    renderWeatherInfo(cityName.value);
  } else {
    displayError("Please enter a city name");
  }
});

// function to render the  weather data to the body

function renderWeatherInfo(city) {

  mainContainer.innerHTML = "";
  getWeatherData(city).then((result) => {
    if (result) {
      errorMsg.classList.remove("display");
      console.log(result.temp);
      const dateTime = formatLocalTime(result.localtime);


      const renderHTML = `
      <section class="section-top">
        <div class="primary-weatherInfos">
          <div class="city-title">${result.address}</div>
          <div class="weather-main-infos">
            <div class="weather-main-infos-middle">
              <div class="weather-icon">
                <img src="${result.weatherIconUrl}" alt="" />
              </div>
              <div class="weather-description">
                <p id="weather-description-value">${result.weatherDescription}</p>
              </div>
              <div class="max-min-temp">
                <div class="max-temp">
                  <img
                    src="assets/icons/arrow-up.svg"
                    alt=""
                  /><span id="max-temp-value">${result.tempMax}</span>
                </div>
                <div class="min-temp">
                  <img
                    src="assets/icons/arrow-down.svg"
                    alt=""
                  />
                  <span id="min-temp-value">${result.tempMin}</span>
                </div>
              </div>
            </div>
            <div class="city-temp">
              <p id=" city-temp-value">${result.temp}</p>
            </div>
          </div>
          <div class="date-time-box">
            <h4>${dateTime.dayOfWeek}</h4>
            <div class="weather-main-infos-time">
              <p>${dateTime.month} ${dateTime.day}, ${dateTime.year}</p>
              <p>${dateTime.hours}:${dateTime.minutes}</p>
            </div>
          </div>
        </div>
        <div class="secondary-weatherInfos">
          <div class="secondary-weatherInfos-boxes">
            <h2>UV Index</h2>
            <div class="secondary-weatherInfos-boxes_bottom">
              <img src="assets/icons/logo/icons8-uv-index-64.png" alt="" />
              <h4>${result.uvIndex}</h4>
            </div>
          </div>
          <div class="secondary-weatherInfos-boxes">
            <h2>Humidity</h2>
            <div class="secondary-weatherInfos-boxes_bottom">
              <img src="assets/icons/logo/icons8-humidity-48.png" alt="" />
              <h4>${result.humidity}%</h4>
            </div>
          </div>
          <div class="secondary-weatherInfos-boxes">
            <h2>Sunrise</h2>
            <div class="secondary-weatherInfos-boxes_bottom">
              <img src="assets/icons/logo/icons8-sunrise-48.png" alt="" />
              <h4>${result.sunrise}</h4>
            </div>
          </div>
          <div class="secondary-weatherInfos-boxes">
            <h2>Sunset</h2>
            <div class="secondary-weatherInfos-boxes_bottom">
              <img src="assets/icons/logo/icons8-sunset-48.png" alt="" />
              <h4>${result.sunset}</h4>
            </div>
          </div>
          <div class="secondary-weatherInfos-boxes">
            <h2>Windspeed</h2>
            <div class="secondary-weatherInfos-boxes_bottom">
              <img
                src="assets/icons/logo/icons8-wind-speed-43-47-48.png"
                alt=""
              />
              <h4>${result.windSpeed}</h4>
            </div>
          </div>
          <div class="secondary-weatherInfos-boxes">
            <h2>Pressure</h2>
            <div class="secondary-weatherInfos-boxes_bottom">
              <img src="assets/icons/logo/icons8-heavy-rain-48.png" alt="" />
              <h4>${result.pressure}</h4>
            </div>
          </div>
        </div>
      </section>
      `;

      mainContainer.innerHTML = renderHTML;
      renderNext5Forecast(city);
    } else {
      displayError("Error: No city Found");
    }
  });
}

// function to display error
function displayError(msg) {
  errorMsg.classList.add("display");
  errorMsg.innerHTML = `<p class="error">${msg}</p>`;
  mainContainer.innerHTML = "";
}

// function to convert temperature
function tempToCelsius(temp) {
  return Math.round(temp - 273.15);
}

// function to format the local time
function formatLocalTime(datetime){
  // create a date object from the datetime

  const date = new Date(datetime);

  //get the day of the week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  //get the horus and minutes then format it ex: 21:52
  //const hours = date.getHours().toString().padStart(2, "0");

  return {
    dayOfWeek: days[date.getDay()],
    day: date.getUTCDate(),
    month: months[date.getUTCMonth()],
    year: date.getUTCFullYear(),
    hours: date.getHours().toString().padStart(2, "0"),
    minutes: date.getMinutes().toString().padStart(2, "0"),
  };

}

// function to fetch data of the next 5 forecast
async function getNext5Forecast(city){
  try{
    const url3 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next5days/?unitGroup=us&key=JN8U4PCMHTWFHCU6JLYSTHNYC`;

    const res3 = await fetch(url3, { mode: "cors" });

    // for debugging
    console.log(res3);
    const res3Content = await res3.json();
    const fiveForecastContent = res3Content.days;

    console.log(fiveForecastContent);
    return fiveForecastContent;
  } catch (error){
    console.log(error)
    displayError("Error: No city Found");
  }
}

// function to render the 5 boxes of the next 5 forecast
function renderNext5Forecast(city){
  getNext5Forecast(city).then(result => {
    const getNext5ForecastContainer = document.createElement("section");
    getNext5ForecastContainer.id = "next5Days-container";

    const heading = document.createElement("h2");
    heading.textContent = "5 Day Forecast";

    // div to store every boxes
    const div = document.createElement("div");
    div.id = "five-forecast-container";

    for (let i = 1; i < result.length; i++) {

      const date = formatLocalTime(result[i].datetime);
      const dayOfWeek = date.dayOfWeek;
      const day = date.day;
      const month = date.month;

      div.innerHTML  += `
        <div class="five-forecast-box">
          <div class="five-forecast-title">
            <h4>${dayOfWeek}</h4>
            <p>${month} ${day}</p>
          </div>
          <div class="five-forecast-icon-box"  >
            <img src="assets/icons/main-icons/${result[i].icon}.svg" id="five-forecast-icon" alt="">
          </div>
          <div class="five-forecast-temp">
            <p>${result[i].temp}</p>
          </div>
        </div>
      `;
    }
    getNext5ForecastContainer.appendChild(heading);
    getNext5ForecastContainer.appendChild(div);
    mainContainer.appendChild(getNext5ForecastContainer);
  console.log(result);
  });
}

