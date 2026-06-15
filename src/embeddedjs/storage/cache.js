const CACHE_KEY = "ticktime_cache";
const TOKEN_KEY = "ticktime_token";
const SETTINGS_KEY = "ticktime_settings";

export function loadCache() {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) {
    return { projects: [], tasksByProject: {}, lastSync: 0 };
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { projects: [], tasksByProject: {}, lastSync: 0 };
  }
}

export function saveCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return { defaultProjectId: null };
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { defaultProjectId: null };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
