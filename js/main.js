// js/main.js

import { getSavedTheme, applyTheme, getOppositeTheme } from "./theme.js";

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
 * Prevent search form from reloading the page.
 * Search logic will be added in the next step.
 */
function initSearchForm() {
    const form = document.getElementById("search-form");
  
    if (!form) return;
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
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