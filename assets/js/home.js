var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");
var currentWeatherEl = document.querySelector("#current-container");
var citySearchEl = document.querySelector("#city-search-zip");
var currentTempEl = document.querySelector("#weather-container");

var i;

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);
};

var getWeather = function(zipCode) {
    var openWeather =  'https://api.openweathermap.org/data/2.5/weather?zip=' +
        zipCode +
    '&appid=b1297dbea07dac5052c9756cbdb9040d'
    fetch(openWeather)       
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayCurrent(data);
                });
        } else {
            alert("Error: Not a valid zip code");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Weather");
    });
    };

var displayCurrent = function(weather) {
    citySearchEl.textContent = weather["name"];
    console.log(weather)

    // create a container for each key value
    var weatherNowEl = document.createElement("p");
    weatherNowEl.classList = "list-item flex-row justify-space-between align-center";
    
    var valueEl = document.createElement("span");
    valueEl.textContent = weather["main"]["humidity"];

    //append to container
    weatherNowEl.appendChild(valueEl);

    //append to dom
    currentTempEl.appendChild(weatherNowEl);

}

var formSubmitHandler = function(event) {
    event.preventDefault();
    var zipCode = searchEl.value.trim();

    if(zipCode) {
        getWeather(zipCode);
        searchEl.value = "";
    }
}


userFormEl.addEventListener("submit", formSubmitHandler)


// array needed
// response.weather[i].description 