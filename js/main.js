// js/main.js

import { getSavedTheme, applyTheme, getOppositeTheme } from "./theme.js";
import { getLastCity, saveLastCity, clearLastCity } from "./storage.js";
import {
  fetchWeatherByCity,
  CityNotFoundError,
  EmptySearchError,
} from "./api.js";
import {
  renderCurrentWeather,
  renderForecastStrip,
  renderHourlyInsights,
  showWeatherContent,
  resetToEmptyState,
} from "./ui.js";

const MOBILE_NAV_BREAKPOINT = 480;

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = getOppositeTheme(currentTheme);
    applyTheme(newTheme);
  });
}

function closeNavMenu(nav, navToggle) {
  if (!nav || !navToggle) return;

  nav.classList.remove("nav--open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

function openNavMenu(nav, navToggle) {
  if (!nav || !navToggle) return;

  nav.classList.add("nav--open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
}

function initNavToggle() {
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  const header = document.querySelector(".header");

  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("nav--open");

    if (isOpen) {
      closeNavMenu(nav, navToggle);
    } else {
      openNavMenu(nav, navToggle);
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("nav--open")) return;
    if (header && header.contains(event.target)) return;
    closeNavMenu(nav, navToggle);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavMenu(nav, navToggle);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= MOBILE_NAV_BREAKPOINT) {
      closeNavMenu(nav, navToggle);
    }
  });

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      closeNavMenu(nav, navToggle);
    });
  });
}

function initNavLinks() {
  const navLinks = document.querySelectorAll(
    ".nav__link:not(.nav__link--active)"
  );

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
    renderForecastStrip(weatherData.forecast, weatherData.location.timezone);
    renderHourlyInsights(weatherData.forecast, weatherData.location.timezone);
    showWeatherContent();

    saveLastCity(cityName);
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

function handleClearCity() {
  clearLastCity();
  resetToEmptyState();

  const cityInput = document.getElementById("city-input");
  if (cityInput) {
    cityInput.value = "";
    cityInput.disabled = false;
  }

  hideError();
  setLoading(false);
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

function initClearCity() {
  const searchClearBtn = document.getElementById("clear-city-btn");

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleClearCity();
    });
  }

  const card = document.getElementById("current-weather");

  if (card) {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".clear-city-btn")) {
        event.preventDefault();
        handleClearCity();
      }
    });
  }
}

function restoreLastCity() {
  const savedCity = getLastCity();

  if (!savedCity) return;

  const cityInput = document.getElementById("city-input");
  if (cityInput) {
    cityInput.value = savedCity;
  }

  handleSearch(savedCity);
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getSavedTheme());
  initThemeToggle();
  initNavToggle();
  initNavLinks();
  initSearchForm();
  initClearCity();

  setLoading(false);
  hideError();
  resetToEmptyState();

  restoreLastCity();
});