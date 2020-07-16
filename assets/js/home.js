var cities = [];
var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");
var currentContainerEl = document.querySelector("#current-container");
var citySearchEl = document.querySelector("#city-search-zip");
var rightNowEl = document.querySelector("#right-now");
var savedCitiesEl = document.querySelector(".list-group-item");

var getWeather = function(city) {
    var openWeather =  'https://api.openweathermap.org/data/2.5/weather?q=' +
        city +
    '&appid=b1297dbea07dac5052c9756cbdb9040d'
    fetch(encodeURI(openWeather))       
        .then(function(response) {
            if (response.ok) { 
                return response.json()
            } else {
                alert("Error: Not a valid city.");
            }
        })
        .then(function(openWeatherData) {
            var lat = openWeatherData["coord"]["lat"];
            var lon = openWeatherData["coord"]["lon"];
            console.log(openWeather); 
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
    var openForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' +
        city
        + '&appid=b1297dbea07dac5052c9756cbdb9040d'
    fetch (encodeURI(openForecast)) 
    .then(function(response) {
        if (response.ok) { 
            return response.json();
        } else {
            alert("Error: Not a valid city.");
        }
    })
    .then(function(openForecastData) {
        console.log(openForecastData);
        displayForecast(openForecastData);
    });
};

var displayUV = function(sunIndex) {
    var weatherNowEl = document.querySelector("#weather-now");
    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV:  " + sunIndex;
    weatherNowEl.appendChild(uvIndexEl);
};

// get current date
var now = moment().format("dddd, MMMM Do");

var displayCurrent = function(weather) {
    citySearchEl.textContent = weather["name"] + " " + now;

    // create a container for each key value
    var weatherNowEl = document.createElement("p");
    weatherNowEl.setAttribute("id","weather-now");
    weatherNowEl.classList = "list-item flex-row justify-space-between align-center";
    
    // get temp and convert
    var temp = weather["main"]["temp"];

    var fahrenheit = convertTemp(temp);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Tempreature:  " + fahrenheit
    
    // get humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity:  " +  weather["main"]["humidity"] + "%";

    // get wind speed
    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed:  " + weather["wind"]["speed"] + " mph";

    //append to container
    weatherNowEl.appendChild(tempEl);
    weatherNowEl.appendChild(humidityEl);
    weatherNowEl.appendChild(windEl);
 
    // remove appended child from rightNowEl
    while (rightNowEl.hasChildNodes()){
        rightNowEl.removeChild(rightNowEl.firstChild);
    }

    //append to dom
    rightNowEl.appendChild(weatherNowEl);
};

// display forecast
var displayForecast = function(forecast) {

    for (var i = 0; i < 5; i++) {
        console.log("#card-" + i);
        var forecastCardId = "#card-" + i;
        var forecastCardEl = document.querySelector(forecastCardId);
        var forecastDateEl = document.createElement("p");
        var forecastDescriptionEl = document.createElement("p");
        var forecastTempEl = document.createElement("p");
        var forecastHumidEl = document.createElement("p");

        var num = (i * 9) - 1;
        if (num < 0) {
            num = 0;
        }
        var n = num.toString();

        // remove appended child from rightNowEl
        while (forecastCardEl.hasChildNodes()){
            forecastCardEl.removeChild(forecastCardEl.firstChild);
        }

        // append card child elements
        forecastDateEl.textContent = forecast["list"][n]["dt_txt"];
        forecastCardEl.appendChild(forecastDateEl);

        forecastDescriptionEl.textContent = forecast["list"][n]["weather"][0]["description"];
        forecastCardEl.appendChild(forecastDescriptionEl);

        var iconcode = forecast["list"][n]["weather"][0]["icon"];
        var iconURI = 'http://openweathermap.org/img/wn/' + iconcode + '@2x.png';
        var forecastIconEl = document.createElement("img");
        forecastIconEl.setAttribute("src", iconURI);
        forecastCardEl.appendChild(forecastIconEl);

        var temp = forecast["list"][n]["main"]["temp"];
        var fahrenheit = convertTemp(temp); 
        forecastTempEl.textContent = "Temp:  " + fahrenheit;
        forecastCardEl.appendChild(forecastTempEl);

        forecastHumidEl.textContent = "Humidity:  " + forecast["list"][n]["main"]["humidity"] + "%";
        forecastCardEl.appendChild(forecastHumidEl);
    };
};


// convert temp from kelvin to fahrenheit
var convertTemp = function(kelvin) {
    kelvin = parseFloat(kelvin);

    var fahrenheit=((kelvin-273.15)*1.8)+32;

    return parseInt(fahrenheit);
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
    var city = searchEl.value.trim();
    
    if(city) {
        if (cities.indexOf(city) == -1) {
            cities.push(city);
            localStorage.setItem("cities", JSON.stringify(cities));
        }
        getWeather(city);
        searchEl.value = "";
    }
    loadCities();
}

var loadCities = function() {
    cities = JSON.parse(localStorage.getItem("cities"));
    console.log(cities)
    if (cities) {
        console.log(cities);
        while (savedCitiesEl.hasChildNodes()){
            savedCitiesEl.removeChild(savedCitiesEl.firstChild);
        };
        // for every saved city in local storage, a button is created and appended to saveCitiesEl
        for (var i = 0; i < cities.length ; i++) {
            var cityButtonEl = $("<li>").addClass("list-group-item").text(cities[i]);
            $(savedCitiesEl).append(cityButtonEl); 
        //$(cityButtonEl).click(formSubmitHandler(cities)) ;
            
        }
    } else {
        cities = [];        
    }
};

loadCities();

userFormEl.addEventListener("submit", formSubmitHandler)
