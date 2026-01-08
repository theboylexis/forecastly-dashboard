const STORAGE_KEYS = {
    FAVORITES: 'forecastly_favorites',
    THEME: 'forecastly_theme',
    LAST_CITY: 'forecastly_last_city'
};

export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
}

export function addFavorite(city) {
    const favorites = getFavorites();
    if (favorites.includes(city)) {
        return false;
    }
    favorites.push(city);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
}

export function removeFavorite(city) {
    const favorites = getFavorites();
    const index = favorites.indexOf(city);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
}

export function isFavorite(city) {
    return getFavorites().includes(city);
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

export function setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getLastCity() {
    return localStorage.getItem(STORAGE_KEYS.LAST_CITY);
}

export function setLastCity(city) {
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
}