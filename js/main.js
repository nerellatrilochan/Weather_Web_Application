// js/main.js

import { getSavedTheme, applyTheme, getOppositeTheme } from "./theme.js";
import {
  fetchWeatherByCity,
  CityNotFoundError,
  EmptySearchError,
} from "./api.js";
import { renderCurrentWeather, showWeatherContent } from "./ui.js";

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = getOppositeTheme(currentTheme);
    applyTheme(newTheme);
  });
}

function initNavLinks() {
  const navLinks = document.querySelectorAll(".nav__link:not(.nav__link--active)");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
}

function showError(message) {
  const errorBanner = document.getElementById("error-banner");
  const errorMessage = document.getElementById("error-message");

  if (!errorBanner || !errorMessage) return;

  errorMessage.textContent = message;
  errorBanner.hidden = false;
}

function hideError() {
  const errorBanner = document.getElementById("error-banner");
  const errorMessage = document.getElementById("error-message");

  if (!errorBanner || !errorMessage) return;

  errorMessage.textContent = "";
  errorBanner.hidden = true;
}

function setLoading(isLoading) {
  const loadingIndicator = document.getElementById("loading-indicator");
  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");
  const searchButton = searchForm?.querySelector(".search-form__button");

  if (loadingIndicator) {
    loadingIndicator.hidden = !isLoading;
  }

  if (searchForm) {
    searchForm.classList.toggle("search-form--loading", isLoading);
  }

  if (cityInput) {
    cityInput.disabled = isLoading;
  }

  if (searchButton) {
    searchButton.disabled = isLoading;
  }
}

async function handleSearch(cityName) {
  hideError();
  setLoading(true);

  try {
    const weatherData = await fetchWeatherByCity(cityName);

    renderCurrentWeather(weatherData.location, weatherData.forecast);
    showWeatherContent();
  } catch (error) {
    console.error("Search failed:", error);

    if (error instanceof EmptySearchError) {
      showError(error.message);
    } else if (error instanceof CityNotFoundError) {
      showError("City not found. Try a different name.");
    } else if (error.message && error.message.includes("timed out")) {
      showError(error.message);
    } else {
      showError(
        "Unable to fetch weather. Open the app with Live Server (not file://) and check your connection."
      );
    }
  } finally {
    setLoading(false);
  }
}

function initSearchForm() {
  const form = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");

  if (!form || !cityInput) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearch(cityInput.value);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getSavedTheme());
  initThemeToggle();
  initNavLinks();
  initSearchForm();

  setLoading(false);
  hideError();
});