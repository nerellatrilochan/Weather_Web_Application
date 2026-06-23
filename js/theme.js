// js/theme.js

const THEME_STORAGE_KEY = "weather-app-theme";
const VALID_THEMES = ["light", "dark"];

/**
 * Returns the saved theme from localStorage, or "light" as default.
 */
export function getSavedTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return VALID_THEMES.includes(saved) ? saved : "light";
}

/**
 * Applies a theme to the page by setting data-theme on <html>.
 * Also saves the choice to localStorage.
 */
export function applyTheme(theme) {
  const validTheme = VALID_THEMES.includes(theme) ? theme : "light";
  document.documentElement.setAttribute("data-theme", validTheme);
  localStorage.setItem(THEME_STORAGE_KEY, validTheme);
}

/**
 * Returns whichever theme is NOT currently active.
 */
export function getOppositeTheme(currentTheme) {
  return currentTheme === "light" ? "dark" : "light";
}