document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

function fetchWeatherData(city) {
    const apiKey = '9da88edda482a208534c2cfad233086a';
    showSpinner();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            updateWeather(data);
            fetchForecastData(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('City not found. Please try again.');
        })
        .finally(() => hideSpinner());
}

function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function fetchForecastData(city) {
    const apiKey = '9da88edda482a208534c2cfad233086a';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            updateHourlyForecast(data);
            updateDailyForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function updateWeather(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('date').innerText = new Date().toLocaleDateString();
    document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function updateHourlyForecast(data) {
    const today = new Date().toISOString().split('T')[0];
    const hourlyData = data.list.filter(item => item.dt_txt.startsWith(today));

    const hourlyForecastContent = document.querySelector('.hourly-forecast-content');
    hourlyForecastContent.innerHTML = '';

    hourlyData.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = `${Math.round(item.main.temp)}°C`;
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const description = item.weather[0].description;

        hourlyForecastContent.innerHTML += `
            <div class="forecast-item">
                <div class="forecast-time">${time}</div>
                <div class="forecast-temp">${temp}</div>
                <div class="forecast-icon"><img src="${icon}" alt="Weather icon"></div>
                <div class="forecast-description">${description}</div>
            </div>
        `;
    });
}

function updateDailyForecast(data) {
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    const dailyForecastContent = document.querySelector('.daily-forecast-content');
    dailyForecastContent.innerHTML = '';

    dailyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = `${Math.round(item.main.temp)}°C`;
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const description = item.weather[0].description;

        dailyForecastContent.innerHTML += `
            <div class="forecast-item">
                <div class="forecast-date">${dayName}</div>
                <div class="forecast-temp">${temp}</div>
                <div class="forecast-icon"><img src="${icon}" alt="Weather icon"></div>
                <div class="forecast-description">${description}</div>
            </div>
        `;
    });
}
