let currentTempUnit = 'C'; // Default to Celsius
let weatherDataGlobal = {}; // To store the weather data globally

document.getElementById('get-weather').addEventListener('click', function() {
    const zipCode = document.getElementById('zip-code').value;
    const apiKey = '0a9ac960c6784522a6cc51bc161c38a8';

    if (!zipCode) {
        alert('Please enter a zip code.');
        return;
    }

    fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`)
        .then(response => response.json())
        .then(async data => {
            if (data.cod && data.cod !== 200) {
                throw new Error(data.message);
            }

            const { lat, lon, name: city } = data;

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            const weatherData = await response.json();

            if (weatherData.cod && weatherData.cod !== 200) {
                throw new Error(weatherData.message);
            }

            weatherDataGlobal = {
                ...weatherData,
                city
            };
            displayWeatherData();
            setWeatherBackground(weatherData.weather[0].main);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Could not retrieve weather data. Please try again.');
        });
});

document.getElementById('toggle-temp-unit').addEventListener('click', function() {
    if (currentTempUnit === 'C') {
        currentTempUnit = 'F';
        this.textContent = 'Toggle to °C';
    } else {
        currentTempUnit = 'C';
        this.textContent = 'Toggle to °F';
    }
    displayWeatherData();
});

function displayWeatherData() {
    const currentDate = new Date().toLocaleDateString();
    const currentTemp = convertTemp(weatherDataGlobal.main.temp);
    const currentConditions = weatherDataGlobal.weather[0].description;
    const tempHigh = convertTemp(weatherDataGlobal.main.temp_max);
    const tempLow = convertTemp(weatherDataGlobal.main.temp_min);

    document.getElementById('current-date').textContent = `Current Date: ${currentDate}`;
    document.getElementById('city').textContent = `City: ${weatherDataGlobal.city}`;
    document.getElementById('current-temp').textContent = `Current Temperature: ${currentTemp} °${currentTempUnit}`;
    document.getElementById('current-conditions').textContent = `Current Conditions: ${currentConditions}`;
    document.getElementById('temp-high-low').textContent = `Temp Hi/Lo: ${tempHigh} °${currentTempUnit} / ${tempLow} °${currentTempUnit}`;
}

function convertTemp(kelvin) {
    if (currentTempUnit === 'C') {
        return (kelvin - 273.15).toFixed(2);
    } else {
        return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
    }
}

function setWeatherBackground(condition) {
    const body = document.body;
    body.className = ''; // Clear any previous condition classes

    switch (condition.toLowerCase()) {
        case 'clear sky':
            body.classList.add('clear-sky');
            break;
        case 'few clouds':
            body.classList.add('few-clouds');
            break;
        case 'scattered clouds':
            body.classList.add('scattered-clouds');
            break;
        case 'broken clouds':
            body.classList.add('broken-clouds');
            break;
        case 'shower rain':
            body.classList.add('shower-rain');
            break;
        case 'rain':
            body.classList.add('rain');
            break;
        case 'thunderstorm':
            body.classList.add('thunderstorm');
            break;
        case 'snow':
            body.classList.add('snow');
            break;
        case 'mist':
            body.classList.add('mist');
            break;
        default:
            break;
    }
}
