// js/main.js

import { getSavedTheme, applyTheme, getOppositeTheme } from "./theme.js";
import {
  fetchWeatherByCity,
  CityNotFoundError,
  EmptySearchError,
} from "./api.js";

/**
 * Wire up the theme toggle button.
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = getOppositeTheme(currentTheme);
    applyTheme(newTheme);
  });
}

/**
 * Prevent non-functional nav links from jumping to top of page.
 */
function initNavLinks() {
  const navLinks = document.querySelectorAll(".nav__link:not(.nav__link--active)");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
}

/**
 * Show the error banner with a message.
 */
function showError(message) {
  const errorBanner = document.getElementById("error-banner");
  const errorMessage = document.getElementById("error-message");

  if (!errorBanner || !errorMessage) return;

  errorMessage.textContent = message;
  errorBanner.hidden = false;
}

/**
 * Hide the error banner and clear its message.
 */
function hideError() {
  const errorBanner = document.getElementById("error-banner");
  const errorMessage = document.getElementById("error-message");

  if (!errorBanner || !errorMessage) return;

  errorMessage.textContent = "";
  errorBanner.hidden = true;
}

/**
 * Show or hide the loading spinner and disable the search form.
 */
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

/**
 * Handle the full search flow: loading → API → log or error.
 */
async function handleSearch(cityName) {
  hideError();
  setLoading(true);

  try {
    const weatherData = await fetchWeatherByCity(cityName);

    // Milestone 2 deliverable: log data to console
    // Milestone 3 will use this data to render the weather card
    console.log("Weather data:", weatherData);
  } catch (error) {
    if (error instanceof EmptySearchError) {
      showError(error.message);
    } else if (error instanceof CityNotFoundError) {
      showError("City not found. Try a different name.");
    } else {
      showError("Unable to fetch weather. Check your connection and try again.");
      console.error("Search error:", error);
    }
  } finally {
    setLoading(false);
  }
}

/**
 * Wire up the search form submit handler.
 */
function initSearchForm() {
  const form = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");

  if (!form || !cityInput) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearch(cityInput.value);
  });
}

// ── Boot ──
document.addEventListener("DOMContentLoaded", () => {
  // 1. Restore saved theme immediately (prevents flash of wrong theme)
  applyTheme(getSavedTheme());

  // 2. Wire up interactive elements
  initThemeToggle();
  initNavLinks();
  initSearchForm();
});