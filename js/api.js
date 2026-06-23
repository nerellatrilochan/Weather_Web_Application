// js/api.js

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Custom error when geocoding finds no city.
 */
export class CityNotFoundError extends Error {
  constructor(message = "City not found.") {
    super(message);
    this.name = "CityNotFoundError";
  }
}

/**
 * Custom error when search input is empty.
 */
export class EmptySearchError extends Error {
  constructor(message = "Please enter a city name.") {
    super(message);
    this.name = "EmptySearchError";
  }
}

/**
 * Fetch with a timeout so loading never spins forever.
 */
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Request timed out. Use Live Server (http://localhost) and check your internet."
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Step 1: City name → coordinates
 * Docs: https://open-meteo.com/en/docs/geocoding-api
 */
async function searchCity(cityName) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en`;

  console.log("Geocoding request:", url);

  const data = await fetchWithTimeout(url);

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
 * Step 2: Coordinates → weather data
 * Docs: https://open-meteo.com/en/docs
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

  console.log("Forecast request:", url);

  return fetchWithTimeout(url);
}

/**
 * Main function: city name → { location, forecast }
 */
export async function fetchWeatherByCity(cityName) {
  const trimmedCity = cityName.trim();

  if (!trimmedCity) {
    throw new EmptySearchError();
  }

  const location = await searchCity(trimmedCity);
  console.log("City found:", location);

  const forecast = await getForecast(location.latitude, location.longitude);
  console.log("Forecast received for:", location.name);

  return {
    location,
    forecast,
  };
}