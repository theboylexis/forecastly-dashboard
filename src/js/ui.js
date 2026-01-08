import { getWeatherIconClass } from './api.js';

const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('errorMessage'),
    weatherContent: document.getElementById('weatherContent'),
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    weatherIcon: document.getElementById('weatherIcon'),
    temperature: document.getElementById('temperature'),
    weatherDescription: document.getElementById('weatherDescription'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    visibility: document.getElementById('visibility'),
    feelsLike: document.getElementById('feelsLike'),
    favoriteBtn: document.getElementById('favoriteBtn'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    favoritesList: document.getElementById('favoritesList'),
    favoritesEmpty: document.getElementById('favoritesEmpty'),
    themeToggle: document.getElementById('themeToggle')
};

export function showLoading() {
    elements.loading.classList.add('show');
    elements.weatherContent.classList.remove('show');
    elements.errorMessage.classList.remove('show');
}

export function hideLoading() {
    elements.loading.classList.remove('show');
}

export function showError() {
    elements.errorMessage.classList.add('show');
    elements.loading.classList.remove('show');
    elements.weatherContent.classList.remove('show');
}

export function hideError() {
    elements.errorMessage.classList.remove('show');
}

export function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}

export function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export function getDayName(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

export function displayCurrentWeather(data) {
    elements.cityName.textContent = data.name;
    elements.currentDate.textContent = formatDate(data.dt);
    elements.weatherIcon.className = `wi ${getWeatherIconClass(data.weather[0].icon)} current-weather__icon`;
    elements.temperature.textContent = Math.round(data.main.temp);
    elements.weatherDescription.textContent = data.weather[0].description;
    elements.humidity.textContent = data.main.humidity + '%';
    elements.windSpeed.textContent = data.wind.speed + ' km/h';
    elements.visibility.textContent = (data.visibility / 1000).toFixed(1) + ' km';
    elements.feelsLike.textContent = Math.round(data.main.feels_like) + '°C';

    hideLoading();
    hideError();
    elements.weatherContent.classList.add('show');
}

export function displayHourlyForecast(data) {
    const hourlyData = data.list.slice(0, 8);

    const htmlString = hourlyData.map(item => {
        return `
            <div class="hourly-item">
                <span class="hourly-item__time">${formatTime(item.dt)}</span>
                <i class="wi ${getWeatherIconClass(item.weather[0].icon)} hourly-item__icon"></i>
                <span class="hourly-item__temp">${Math.round(item.main.temp)}°</span>
            </div>
        `;
    }).join('');

    elements.hourlyForecast.innerHTML = htmlString;
}

export function displayDailyForecast(data) {
    const dailyData = data.list.filter(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
    }).slice(0, 5);

    const htmlString = dailyData.map(item => {
        return `
            <div class="daily-item">
                <span class="daily-item__day">${getDayName(item.dt)}</span>
                <i class="wi ${getWeatherIconClass(item.weather[0].icon)} daily-item__icon"></i>
                <span class="daily-item__description">${item.weather[0].description}</span>
                <div class="daily-item__temps">
                    <span class="daily-item__temp-high">${Math.round(item.main.temp_max)}°</span>
                    <span class="daily-item__temp-low">${Math.round(item.main.temp_min)}°</span>
                </div>
            </div>
        `;
    }).join('');

    elements.dailyForecast.innerHTML = htmlString;
}

export function displayFavorites(favorites, onCityClick, onRemoveClick) {
    if (favorites.length === 0) {
        elements.favoritesEmpty.classList.remove('hidden');
        elements.favoritesList.innerHTML = '';
        return;
    }

    elements.favoritesEmpty.classList.add('hidden');

    const htmlString = favorites.map(city => {
        return `
            <li class="favorites__item" data-city="${city}">
                <div class="favorites__item-info">
                    <span class="favorites__item-city">${city}</span>
                </div>
                <button class="favorites__item-remove" data-city="${city}">×</button>
            </li>
        `;
    }).join('');

    elements.favoritesList.innerHTML = htmlString;

    elements.favoritesList.querySelectorAll('.favorites__item').forEach(item => {
        item.addEventListener('click', () => {
            const city = item.dataset.city;
            onCityClick(city);
        });
    });

    elements.favoritesList.querySelectorAll('.favorites__item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const city = btn.dataset.city;
            onRemoveClick(city);
        });
    });
}

export function updateFavoriteButton(isFav) {
    if (isFav) {
        elements.favoriteBtn.classList.add('active');
    } else {
        elements.favoriteBtn.classList.remove('active');
    }
}

export { elements };