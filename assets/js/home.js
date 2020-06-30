var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");
var currentWeatherEl = document.querySelector("#current-container");

var i;

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);
};

var getWeather = function(zipCode) {
    var openWeather =  'https://api.openweathermap.org/data/2.5/weather?zip=' +
        "78251" +
    '&appid=b1297dbea07dac5052c9756cbdb9040d'
    fetch(openWeather)       
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayCurrent(data);
                });
        } else {
            alert("Error:" + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Weather");
    });
    };

var displayCurrent = function(weather) {
    currentWeatherEl.textContent = "";
    //searchEl.textContent = zip;

    //check if api returend results
    if (weather.length === 0) {
        currentWeatherEl.textContent = "No weather found.";
        }
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