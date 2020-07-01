var userFormEl = document.querySelector("#user-form");
var searchEl = document.querySelector("#search");
var currentContainerEl = document.querySelector("#current-container");
var citySearchEl = document.querySelector("#city-search-zip");
var rightNowEl = document.querySelector("#right-now");

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
    
    var temp = weather["main"]["temp"];

    var fahrenheit = convertTemp(temp);
    console.log(fahrenheit);

    var tempEl = document.createElement("p");
    tempEl.textContent = fahrenheit
    
    
    
    var humidityEl = document.createElement("p");
    humidityEl.textContent = weather["main"]["humidity"];

    //append to container
    weatherNowEl.appendChild(tempEl);
    weatherNowEl.appendChild(humidityEl);

    //append to dom
    rightNowEl.appendChild(weatherNowEl);

};

// convert temp from kelvin to fahrenheit
var convertTemp = function(kelvin) {
    kelvin = parseFloat(kelvin);

    var fahrenheit=((kelvin-273.15)*1.8)+32;
    console.log(fahrenheit);

    return fahrenheit;
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