// js/api.js

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Custom error thrown when the geocoding API finds no matching city.
 * Using a custom class lets main.js show a specific user-friendly message.
 */
export class CityNotFoundError extends Error {
  constructor(message = "City not found.") {
    super(message);
    this.name = "CityNotFoundError";
  }
}

/**
 * Custom error thrown when the user submits an empty search.
 */
export class EmptySearchError extends Error {
  constructor(message = "Please enter a city name.") {
    super(message);
    this.name = "EmptySearchError";
  }
}

/**
 * Step 1: Convert a city name into coordinates using Open-Meteo Geocoding API.
 */
async function searchCity(cityName) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new CityNotFoundError();
  }

  const city = data.results[0];

  return {
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
  };
}

/**
 * Step 2: Fetch weather data for the given coordinates.
 * We request fields needed for Milestones 3 and 4 as well.
 */
async function getForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5",
  });

  const url = `${FORECAST_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  return response.json();
}

/**
 * Main exported function: city name → location + forecast data.
 */
export async function fetchWeatherByCity(cityName) {
  const trimmedCity = cityName.trim();

  if (!trimmedCity) {
    throw new EmptySearchError();
  }

  const location = await searchCity(trimmedCity);
  const forecast = await getForecast(location.latitude, location.longitude);

  return {
    location,
    forecast,
  };
}