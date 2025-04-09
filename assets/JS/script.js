// https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr;

//http://api.weatherstack.com/current?access_key=9eb96fbc693de8930d830f5cef2eb0a4& query=New York
const APIkey = "9eb96fbc693de8930d830f5cef2eb0a4"; // Please don't use me 😿

const cityName = document.querySelector("#city-name");
const searchBtn = document.querySelector("#search-btn");
const errorMsg = document.querySelector(".error-container");

//fetch the weather data
async function getWeatherData(city) {
  try {
    const url = `https://api.weatherstack.com/current?access_key=${APIkey}&query=${city}`;

    const url2 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=290cf603e9b9bafeb302e7bd44ef67cb`;

    const res = await fetch(url, { mode: "cors" });
    const res2 = await fetch(url2, { mode: "cors" });

    //for debugging
    console.log(res);
    console.log(res2);

    const weatherData = await res.json();
    const weatherData2 = await res2.json();
    console.log(weatherData);
    console.log(weatherData2);

    //All the informations of the API

    return {
      cityName: weatherData.location.name,
      region: weatherData.location.region,
      country: weatherData.location.country,
      localtime: weatherData.location.localtime,

      temp: `${tempToCelsius(weatherData2.main.temp)} °C`,
      tempMin: `${tempToCelsius(weatherData2.main.temp_min)} °C`,
      tempMax: `${tempToCelsius(weatherData2.main.temp_max)} °C`,
      weatherId: weatherData2.weather[0].id,
      weatherDescription: weatherData2.weather[0].description,
      weatherIconUrl: ` https://openweathermap.org/img/wn/${weatherData2.weather[0].icon}@2x.png`,
      uvIndex: weatherData.current.uv_index,
      humidity: weatherData2.main.humidity,
      sunrise: weatherData.current.astro.sunrise,
      sunset: weatherData.current.astro.sunset,
      pressure: weatherData2.main.pressure,
      windSpeed: weatherData2.wind.speed,
      isDay: weatherData.current.is_day,
    };
  } catch (error) {
    displayError(error.message);
  }
}

// button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cityName.value) {
    renderWeatherInfo(cityName.value);
  } else {
    displayError("Please enter a city name");
  }
});

// function to render the  weather data to the body

function renderWeatherInfo(city) {
  const mainContainer = document.querySelector("#main-container");
  mainContainer.innerHTML = "";
  getWeatherData(city).then((result) => {
    if (result) {
      errorMsg.classList.remove("display");
      console.log(result.temp);

      const renderHTML = `
      <section class="section-top">
        <div class="primary-weatherInfos">
          <div class="city-title">${result.cityName}, ${result.region}, ${result.country}</div>
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
                    src="assets/icons/logo/icons8-arrow-up-48.png"
                    alt=""
                  /><span id="max-temp-value">${result.tempMax}</span>
                </div>
                <div class="min-temp">
                  <img
                    src="assets/icons/logo/icons8-arrow-down-94.png"
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
            <h4>Monday</h4>
            <div class="weather-main-infos-time">
              <p>April 7th, 2025</p>
              <p>21:52</p>
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
    } else {
      displayError("Error: No city Found");
    }
  });
}

// function to display error
function displayError(msg) {
  errorMsg.classList.add("display");
  errorMsg.innerHTML = `<p class="error">${msg}</p>`;
}

// function to convert temperature
function tempToCelsius(temp) {
  return Math.round(temp - 273.15);
}
