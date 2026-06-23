// js/ui.js

import {
    getWeatherInfo,
    getTempAccentClass,
    formatCurrentDate,
    formatTemperature,
  } from "./weather.js";
  
  /* ── Small inline SVGs for stat badges & date ── */
  
  const ICON_CALENDAR = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>`;
  
  const ICON_HUMIDITY = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="none">
    <path d="M12 2.5c-4 5.5-7 9.5-7 13a7 7 0 0 0 14 0c0-3.5-3-7.5-7-13z"/>
  </svg>`;
  
  const ICON_WIND = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2"/>
    <path d="M12.59 19.41A2 2 0 1 0 14 16H2"/>
    <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>`;
  
  const ICON_PRESSURE = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="7 10 12 5 17 10"/>
    <polyline points="7 14 12 19 17 14"/>
  </svg>`;
  
  /**
   * Show weather sections, hide empty-state hint.
   */
  export function showWeatherContent() {
    const emptyState = document.getElementById("empty-state");
    const weatherContent = document.getElementById("weather-content");
  
    if (emptyState) emptyState.hidden = true;
    if (weatherContent) weatherContent.hidden = false;
  }
  
  /**
   * Hide weather sections, show empty-state hint.
   * (Used in Milestone 5 for reset — defined now for consistency.)
   */
  export function hideWeatherContent() {
    const emptyState = document.getElementById("empty-state");
    const weatherContent = document.getElementById("weather-content");
    const currentWeather = document.getElementById("current-weather");
  
    if (emptyState) emptyState.hidden = false;
    if (weatherContent) weatherContent.hidden = true;
    if (currentWeather) currentWeather.innerHTML = "";
  }
  
  /**
   * Build and inject the current weather card HTML.
   */
  export function renderCurrentWeather(location, forecast) {
    const card = document.getElementById("current-weather");
    if (!card) return;
  
    const current = forecast.current;
    const units = forecast.current_units || {};
  
    const { label, iconSvg } = getWeatherInfo(current.weather_code);
    const tempClass = getTempAccentClass(current.temperature_2m);
    const tempValue = formatTemperature(current.temperature_2m);
    const dateStr = formatCurrentDate(current.time, location.timezone);
  
    const tempUnitRaw = units.temperature_2m || "°C";
    const tempUnitLetter = tempUnitRaw.replace("°", "").toLowerCase();
  
    const humidity = Math.round(current.relative_humidity_2m);
    const windSpeed = Math.round(current.wind_speed_10m);
    const windUnit = units.wind_speed_10m || "km/h";
    const pressure = Math.round(current.surface_pressure);
  
    const locationLabel = `${location.name}, ${location.country}`;
  
    card.innerHTML = `
      <header class="current-weather__header">
        <h2 class="current-weather__location">${locationLabel}</h2>
        <p class="current-weather__date">
          ${ICON_CALENDAR}
          <time datetime="${current.time}">${dateStr}</time>
        </p>
      </header>
  
      <div class="current-weather__body">
        <div class="current-weather__main">
          <p class="current-weather__temp ${tempClass}">
            <span class="current-weather__temp-value">${tempValue}°</span>
            <span class="current-weather__temp-unit">${tempUnitLetter}</span>
          </p>
          <div class="current-weather__condition">
            ${iconSvg}
            <span>${label}</span>
          </div>
        </div>
  
        <ul class="current-weather__stats">
          <li class="stat-badge">
            <span class="stat-badge__icon">${ICON_HUMIDITY}</span>
            <span class="stat-badge__label">Humidity</span>
            <span class="stat-badge__value">${humidity}%</span>
          </li>
          <li class="stat-badge">
            <span class="stat-badge__icon">${ICON_WIND}</span>
            <span class="stat-badge__label">Wind Speed</span>
            <span class="stat-badge__value">${windSpeed} ${windUnit}</span>
          </li>
          <li class="stat-badge">
            <span class="stat-badge__icon">${ICON_PRESSURE}</span>
            <span class="stat-badge__label">Pressure</span>
            <span class="stat-badge__value">${pressure} hPa</span>
          </li>
        </ul>
      </div>
    `;
  }