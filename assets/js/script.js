var citieslistEl = document.querySelector('#cities-list');
var cityforecastEl = document.querySelector('#city-forecast');
var weekforecastEl = document.querySelector('#week-forecast');

// define two variables that get the city name the user inputs
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');

// add event listener to get the value in the input when the user clicks submit
weatherForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // get the value the user submitted in the input element
  const cityName = cityInput.value;
  document.getElementById('cityName').innerHTML = cityName;
  document.getElementById('dateNow').innerHTML = dayjs().format('M/DD/YYYY');

  // call the function
  getWeatherData(cityName);
  getWeatherForecast(cityName);
  saveCity(cityName);

});

// function for api call to get today's weather data for the given city
function getWeatherData(cityName) {
  // define api key and url
  const apiKey = "db5619aadd74bfa8e55b11f55f78e0b7"; 
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

  // use fetch to grab the data
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      
      // pass in our data to the function that will display the weather details
      weatherDetails(data); 

    })
    // catch any errors
    .catch(error => {
      console.error('Error:', error);
    });
}

// function for extracting weather details we care about
function weatherDetails( d ) {

  // define temperature variable for storing the temperature (get temp in Fahrenheit)
  var temperature = Math.round(((d.main.temp - 273.15)*1.8)+32);
  // store the wind speed
  var wind = d.wind.speed;
  // store the humidity
  var humidity = d.main.humidity;
  
  // set the different html elements to hold the values we extracted previously
  document.getElementById('wind').innerHTML = "Wind: " + wind + ' MPH' ;
  document.getElementById('humidity').innerHTML = "Humidity: " + humidity + '%' ;
  document.getElementById('temperature').innerHTML = "Temp: " + temperature + '\u00B0F' ;

  var iconCode = d.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
  document.getElementById('weatherIcon').setAttribute('src', iconUrl);
  
}

// function for api call to get the 5 day forecast
function getWeatherForecast(cityName) {
  const apiKey = "db5619aadd74bfa8e55b11f55f78e0b7"; 
  const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {

      // Clear current results
      weekforecastEl.innerHTML = "";
      weatherForecastDetails(data); 
      // console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function weatherForecastDetails(d){
  var list = d.list;
  
  for(let i = 5; i < list.length; i=i+8){

    // weekCard
    var weekCard = document.createElement("div");
    weekCard.classList.add('card', 'col-md-2', 'weekcard');
    weekCard.style.backgroundColor = 'lightblue';
    
    // cardBody
    var cardBody = document.createElement("div");
    cardBody.classList.add('card-body', 'h6');

    // get date
    const dateH2 = document.createElement("p");
    const date = list[i].dt_txt.slice(0,10);
    const formattedDate = dayjs(date).format('M/DD/YYYY');
    dateH2.innerHTML = formattedDate;
   
    // get weathericon
    var weatherIcon = document.createElement("img");
    var iconCode = list[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    weatherIcon.setAttribute("src", iconUrl);
  
    // get temperature
    const tempH2 = document.createElement("p");
    temperature = Math.round(((d.list[i].main.temp - 273.15)*1.8)+32);
    tempH2.innerHTML = " Temp: " + temperature + '\u00B0F' ;

    // get wind speed
    const windH2 = document.createElement("p");
    windH2.innerHTML = " Wind: " + list[i].wind.speed + ' MPH ';

    // get humidity 
    const humidityH2 = document.createElement("p");
    humidityH2.innerHTML = "Humidity: " + list[i].main.humidity + ' % ';

    const weekForecastDiv = document.getElementById('week-forecast');
    weekForecastDiv.appendChild(weekCard);
    weekCard.appendChild(cardBody);
    cardBody.appendChild(dateH2);
    cardBody.appendChild(weatherIcon);
    cardBody.appendChild(tempH2);
    cardBody.appendChild(windH2);
    cardBody.appendChild(humidityH2);
  }
}

// create an array where we want to save the list of city names
listOfCities = [];

// saving city to local storage
function saveCity(cityName) {
  
  if(listOfCities.indexOf(cityName) === -1){
    listOfCities.push(cityName);
    localStorage.setItem("cityDisplay", JSON.stringify(listOfCities));

    const displayCityName = document.createElement('button');
    displayCityName.classList.add('btn', 'bg-secondary', 'text-white', 'w-100', 'mt-2');
    displayCityName.setAttribute('id', cityName);
    displayCityName.setAttribute('name', 'city');
    displayCityName.textContent = cityName;
    
    // Add event listener to city btn
    displayCityName.addEventListener('click', function(event) {
      event.preventDefault();

      document.getElementById('cityName').innerHTML = cityName;
      document.getElementById('dateNow').innerHTML = dayjs().format('M/DD/YYYY');

      getWeatherData(cityName);
      getWeatherForecast(cityName);
    });

    citieslistEl.appendChild(displayCityName);
  }
}