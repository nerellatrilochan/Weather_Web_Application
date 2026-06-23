// js/storage.js

const CITY_STORAGE_KEY = "weather-app-last-city";

/**
 * Returns the last searched city from localStorage, or null if none saved.
 */
export function getLastCity() {
  const saved = localStorage.getItem(CITY_STORAGE_KEY);
  const trimmed = saved?.trim();
  return trimmed || null;
}

/**
 * Saves the city name to localStorage after a successful search.
 */
export function saveLastCity(cityName) {
  const trimmed = cityName.trim();
  if (trimmed) {
    localStorage.setItem(CITY_STORAGE_KEY, trimmed);
  }
}

/**
 * Removes the saved city from localStorage (used on reset).
 */
export function clearLastCity() {
  localStorage.removeItem(CITY_STORAGE_KEY);
}