import { getCurrentWeather, getForecast } from './js/api.js';
import { getFavorites, addFavorite, removeFavorite, isFavorite, getTheme, setTheme, getLastCity, setLastCity } from './js/storage.js';
import { elements, showLoading, showError, displayCurrentWeather, displayHourlyForecast, displayDailyForecast, displayFavorites, updateFavoriteButton, applyTheme } from './js/ui.js';

async function searchCity(city) {
  showLoading();

  try {
    const [weather, forecast] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city)
    ]);

    displayCurrentWeather(weather);
    displayHourlyForecast(forecast);
    displayDailyForecast(forecast);
    updateFavoriteButton(isFavorite(city));
    setLastCity(city);
    displayFavorites(getFavorites(), searchCity, handleRemoveFavorite);
  } catch (error) {
    showError();
  }
}

function handleRemoveFavorite(city) {
  removeFavorite(city);
  displayFavorites(getFavorites(), searchCity, handleRemoveFavorite);
  if (elements.cityName.textContent === city) {
    updateFavoriteButton(false);
  }
}

elements.searchBtn.addEventListener('click', () => {
  const city = elements.searchInput.value.trim();
  if (city) {
    searchCity(city);
  }
});

elements.searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const city = elements.searchInput.value.trim();
    if (city) {
      searchCity(city);
    }
  }
});



elements.themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  applyTheme(newTheme);
});

elements.favoriteBtn.addEventListener('click', () => {
  const city = elements.cityName.textContent;
  if (isFavorite(city)) {
    removeFavorite(city);
  } else {
    addFavorite(city);
  }
  updateFavoriteButton(isFavorite(city));
  displayFavorites(getFavorites(), searchCity, handleRemoveFavorite);
});

function init() {
  applyTheme(getTheme());
  displayFavorites(getFavorites(), searchCity, handleRemoveFavorite);

  const lastCity = getLastCity();
  if (lastCity) {
    searchCity(lastCity);
  }
}

init();