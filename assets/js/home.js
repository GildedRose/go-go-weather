var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");
var currentContainerEl = document.querySelector("#current-container");
var citySearchEl = document.querySelector("#city-search-zip");
var rightNowEl = document.querySelector("#right-now");

var getWeather = function(zipCode) {
    var openWeather =  'https://api.openweathermap.org/data/2.5/weather?zip=' +
        zipCode +
    '&appid=b1297dbea07dac5052c9756cbdb9040d'
    fetch(openWeather)       
        .then(function(response) {
            if (response.ok) { 
                return response.json()
            } else {
                alert("Error: Not a valid zip code");
            }
        })
        .then(function(openWeatherData) {
            var lat = openWeatherData["coord"]["lat"];
            var lon = openWeatherData["coord"]["lon"];

            displayCurrent(openWeatherData);

            return fetch(
                'http://api.openweathermap.org/data/2.5/uvi?appid=b1297dbea07dac5052c9756cbdb9040d&lat=' +
                lat + '&lon=' + lon
            );
        })
        .then(function(uvResponse) {
            return uvResponse.json();
        })
        .then(function(uvResponseData){
            uvResponseData["value"];
            displayUV(uvResponseData["value"]);
        })
};

var displayUV = function(sunIndex) {
    var weatherNowEl = document.querySelector("#weather-now");
    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = sunIndex;
    weatherNowEl.appendChild(uvIndexEl);
};

var displayCurrent = function(weather) {
    citySearchEl.textContent = weather["name"];

    // create a container for each key value
    var weatherNowEl = document.createElement("p");
    weatherNowEl.setAttribute("id","weather-now");
    weatherNowEl.classList = "list-item flex-row justify-space-between align-center";
    
    // get temp and convert
    var temp = weather["main"]["temp"];

    var fahrenheit = convertTemp(temp);

    var tempEl = document.createElement("p");
    tempEl.textContent = fahrenheit
    
    // get humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = weather["main"]["humidity"];

    // get wind speed
    var windEl = document.createElement("p");
    windEl.textContent = weather["wind"]["speed"];

    //append to container
    weatherNowEl.appendChild(tempEl);
    weatherNowEl.appendChild(humidityEl);
    weatherNowEl.appendChild(windEl);
 

    //append to dom
    rightNowEl.appendChild(weatherNowEl);

};

// Get Future Forecast
var getForecast = function(zipCode) {
    var openWeather =  'https://api.openweathermap.org/data/2.5/forecast?zip=' +
        zipCode +
    '&appid=b1297dbea07dac5052c9756cbdb9040d'
    fetch(openWeather)       
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayCurrent(data);
                });
        };
    });
};


// convert temp from kelvin to fahrenheit
var convertTemp = function(kelvin) {
    kelvin = parseFloat(kelvin);

    var fahrenheit=((kelvin-273.15)*1.8)+32;

    return fahrenheit;
};


// get UV Index
var getUvIndex = function(lat, lon) {
    var uvIndexApi =  'http://api.openweathermap.org/data/2.5/uvi?appid=b1297dbea07dac5052c9756cbdb9040d&lat=' +
    lat + '&lon=' + lon
    return fetch(uvIndexApi)       
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                return data["value"];
                });
            };
        });
};

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