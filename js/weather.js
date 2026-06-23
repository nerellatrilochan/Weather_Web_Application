// js/weather.js

/**
 * WMO Weather interpretation codes (Open-Meteo)
 * Docs: https://open-meteo.com/en/docs
 */

const WEATHER_ICONS = {
    clear: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`,
  
    partlyCloudy: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="8" cy="8" r="3.5" fill="currentColor" stroke="none"/>
      <path d="M7 18h10a4 4 0 0 0 .5-7.98A5 5 0 0 0 7.5 9.5" fill="currentColor" stroke="none" opacity="0.85"/>
      <path d="M7 18h10a4 4 0 0 0 .5-7.98A5 5 0 0 0 7.5 9.5"/>
    </svg>`,
  
    cloudy: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="none">
      <path d="M7 18h11a4 4 0 0 0 .5-7.98A5.5 5.5 0 0 0 8.5 8.5a5 5 0 0 0-1.5 9.5z"/>
    </svg>`,
  
    fog: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="16" x2="21" y2="16"/>
    </svg>`,
  
    drizzle: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 14h11a4 4 0 0 0 .5-7.98A5.5 5.5 0 0 0 8.5 4.5"/>
      <line x1="8" y1="18" x2="8" y2="20"/><line x1="12" y1="17" x2="12" y2="19"/><line x1="16" y1="18" x2="16" y2="20"/>
    </svg>`,
  
    rain: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 13h11a4 4 0 0 0 .5-7.98A5.5 5.5 0 0 0 8.5 3.5"/>
      <line x1="8" y1="17" x2="6" y2="21"/><line x1="12" y1="16" x2="10" y2="20"/><line x1="16" y1="17" x2="14" y2="21"/>
    </svg>`,
  
    snow: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M7 13h11a4 4 0 0 0 .5-7.98A5.5 5.5 0 0 0 8.5 3.5"/>
      <line x1="8" y1="17" x2="8" y2="21"/><line x1="6" y1="19" x2="10" y2="19"/>
      <line x1="14" y1="17" x2="14" y2="21"/><line x1="12" y1="19" x2="16" y2="19"/>
    </svg>`,
  
    thunder: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 13h11a4 4 0 0 0 .5-7.98A5.5 5.5 0 0 0 8.5 3.5"/>
      <path d="M13 14l-3 5h4l-2 4" fill="currentColor" stroke="none"/>
    </svg>`,
  
    unknown: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
  };
  
  /**
   * Map WMO weather code → human-readable label + icon SVG.
   */
  export function getWeatherInfo(code) {
    const c = Number(code);
  
    if (c === 0) {
      return { label: "Clear Sky", iconSvg: WEATHER_ICONS.clear };
    }
    if (c === 1) {
      return { label: "Mainly Clear", iconSvg: WEATHER_ICONS.partlyCloudy };
    }
    if (c === 2) {
      return { label: "Partly Cloudy", iconSvg: WEATHER_ICONS.partlyCloudy };
    }
    if (c === 3) {
      return { label: "Overcast", iconSvg: WEATHER_ICONS.cloudy };
    }
    if (c === 45 || c === 48) {
      return { label: "Fog", iconSvg: WEATHER_ICONS.fog };
    }
    if (c >= 51 && c <= 57) {
      return { label: "Light Drizzle", iconSvg: WEATHER_ICONS.drizzle };
    }
    if (c >= 61 && c <= 67) {
      return { label: "Rain", iconSvg: WEATHER_ICONS.rain };
    }
    if (c >= 71 && c <= 77) {
      return { label: "Snow", iconSvg: WEATHER_ICONS.snow };
    }
    if (c >= 80 && c <= 82) {
      return { label: "Rain Showers", iconSvg: WEATHER_ICONS.rain };
    }
    if (c >= 85 && c <= 86) {
      return { label: "Snow Showers", iconSvg: WEATHER_ICONS.snow };
    }
    if (c >= 95 && c <= 99) {
      return { label: "Thunderstorm", iconSvg: WEATHER_ICONS.thunder };
    }
  
    return { label: "Unknown", iconSvg: WEATHER_ICONS.unknown };
  }
  
  /**
   * Returns a CSS class for temperature-based accent coloring.
   */
  export function getTempAccentClass(tempCelsius) {
    const temp = Number(tempCelsius);
  
    if (temp <= 0) return "temp--cold";
    if (temp <= 15) return "temp--mild";
    if (temp <= 25) return "temp--warm";
    return "temp--hot";
  }
  
  /**
   * Format ISO time → "Monday, Oct 24" in the city's timezone.
   */
  export function formatCurrentDate(isoTime, timezone) {
    const date = new Date(isoTime);
  
    const options = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
  
    if (timezone) {
      options.timeZone = timezone;
    }
  
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  
  /**
   * Round temperature for the large display value.
   */
  export function formatTemperature(value) {
    return Math.round(Number(value));
  }
  
  /**
   * One decimal place for hourly insights panel (e.g. 12.4°C).
   */
  export function formatHourlyTemperature(value) {
    return Number(value).toFixed(1);
  }
  
  /**
   * Parse Open-Meteo local ISO strings (e.g. "2024-10-24T14:00").
   * API times are already in the location's timezone.
   */
  function parseLocalIso(isoTime) {
    const [dateKey, timePart = "00:00"] = String(isoTime).split("T");
    const hour = parseInt(timePart.slice(0, 2), 10);
    const minute = parseInt(timePart.slice(3, 5), 10) || 0;
  
    return { dateKey, hour, minute };
  }
  
  /**
   * Format hourly time → "14:00" from API local ISO string.
   */
  export function formatHourLabel(isoTime) {
    const { hour, minute } = parseLocalIso(isoTime);
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    return `${h}:${m}`;
  }
  
  /**
   * Build 5 forecast day objects from API daily data.
   */
  export function buildDailyForecast(daily, timezone) {
    if (!daily || !Array.isArray(daily.time)) {
      return [];
    }
  
    return daily.time.slice(0, 5).map((dateStr, index) => {
      const isToday = index === 0;
  
      let dayLabel;
      if (isToday) {
        dayLabel = "TODAY";
      } else {
        const date = new Date(`${dateStr}T12:00:00`);
        const options = { weekday: "short" };
        if (timezone) {
          options.timeZone = timezone;
        }
        dayLabel = new Intl.DateTimeFormat("en-US", options)
          .format(date)
          .toUpperCase();
      }
  
      return {
        dayLabel,
        isToday,
        weatherCode: daily.weather_code[index],
        high: formatTemperature(daily.temperature_2m_max[index]),
        low: formatTemperature(daily.temperature_2m_min[index]),
        dateStr,
      };
    });
  }
  
  /**
   * Build up to 6 hourly entries for the current local day.
   */
  export function buildHourlyInsights(hourly, currentTime) {
    if (!hourly || !Array.isArray(hourly.time) || !currentTime) {
      return [];
    }
  
    const { dateKey: todayKey, hour: currentHour } = parseLocalIso(currentTime);
    const entries = [];
  
    for (let i = 0; i < hourly.time.length && entries.length < 6; i += 1) {
      const isoTime = hourly.time[i];
      const { dateKey, hour } = parseLocalIso(isoTime);
  
      if (dateKey !== todayKey) continue;
      if (hour < currentHour) continue;
  
      entries.push({
        isoTime,
        timeLabel: formatHourLabel(isoTime),
        weatherCode: hourly.weather_code[i],
        temperature: hourly.temperature_2m[i],
      });
    }
  
    return entries;
  }