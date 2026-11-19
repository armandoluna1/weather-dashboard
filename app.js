"use strict";
const el = id => document.getElementById(id);
let place = {name: "Elizabeth", admin1: "New Jersey", country: "United States", latitude: 40.664, longitude: -74.211};
let unit = "F";
let weather = null;
let forecastRequest = 0;
let searchRequest = 0;

const codes = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Freezing fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  56: "Light freezing drizzle", 57: "Freezing drizzle", 61: "Light rain", 63: "Rain",
  65: "Heavy rain", 66: "Light freezing rain", 67: "Heavy freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Light showers", 81: "Rain showers", 82: "Heavy showers",
  85: "Snow showers", 86: "Heavy snow showers", 95: "Thunderstorm",
  96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail"
};

function temperature(value) {
  if (!Number.isFinite(value)) return "Unavailable";
  return Math.round(unit === "F" ? value * 9 / 5 + 32 : value) + "°" + unit;
}
function region(city) {
  return [city.admin1, city.country].filter(Boolean).join(", ");
}
function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}
function render() {
  el("f").setAttribute("aria-pressed", unit === "F");
  el("c").setAttribute("aria-pressed", unit === "C");
  el("week").replaceChildren();
  el("place").textContent = place.name;
  el("region").textContent = region(place);
  el("temp").textContent = weather ? temperature(weather.current.temperature_2m) : "…";
  el("condition").textContent = weather ? codes[weather.current.weather_code] || "Conditions unavailable" : "";
  el("updated").textContent = weather ? "Conditions as of " + weather.current.time.replace("T", " at ") + " local time" : "";
  if (!weather) return;
  const daily = weather.daily;
  daily.time.forEach((date, i) => {
    const card = element("article", "");
    card.className = "day";
    const weekday = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {weekday: "short", timeZone: "UTC"});
    card.append(element("strong", i === 0 ? "Today" : weekday),
      element("p", codes[daily.weather_code[i]] || "Conditions unavailable"),
      element("b", temperature(daily.temperature_2m_max[i])), element("br", ""),
      element("span", "Low " + temperature(daily.temperature_2m_min[i])));
    el("week").append(card);
  });
}
async function getJSON(base, params) {
  const response = await fetch(base + "?" + new URLSearchParams(params));
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}
async function loadWeather() {
  const request = ++forecastRequest;
  el("status").textContent = "Fetching weather…";
  try {
    const data = await getJSON("https://api.open-meteo.com/v1/forecast", {
      latitude: place.latitude, longitude: place.longitude, timezone: "auto", forecast_days: 7,
      current: "temperature_2m,weather_code", daily: "temperature_2m_max,temperature_2m_min,weather_code"
    });
    if (request !== forecastRequest) return;
    weather = data;
    render();
    el("status").textContent = "";
  } catch {
    if (request === forecastRequest) el("status").textContent = weather ?
      "Refresh failed. Showing the last forecast received." : "Weather unavailable. Check your connection and try Refresh weather.";
  }
}
el("search").onsubmit = async event => {
  event.preventDefault();
  const query = el("query").value.trim();
  const request = ++searchRequest;
  el("matches").replaceChildren();
  if (query.length < 2) {
    el("searchStatus").textContent = "Enter at least two characters.";
    return;
  }
  el("searchStatus").textContent = "Searching…";
  try {
    const data = await getJSON("https://geocoding-api.open-meteo.com/v1/search", {name: query, count: 6, language: "en"});
    if (request !== searchRequest) return;
    const cities = data.results || [];
    el("searchStatus").textContent = cities.length ? "Choose a location" : "No matches. Try a nearby city.";
    for (const city of cities) {
      const button = element("button", [city.name, region(city)].filter(Boolean).join(", "));
      button.onclick = () => {
        place = city;
        weather = null;
        el("matches").replaceChildren();
        el("searchStatus").textContent = "";
        el("query").value = city.name;
        render();
        loadWeather();
      };
      el("matches").append(button);
    }
  } catch {
    if (request === searchRequest) el("searchStatus").textContent = "City search unavailable. Try again.";
  }
};
for (const choice of ["F", "C"]) {
  el(choice.toLowerCase()).onclick = () => { unit = choice; render(); };
}
el("refresh").onclick = loadWeather;
render();
loadWeather();
