export const getStoredValue = (key, fallback) => {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export const setStoredValue = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local storage can fail in restricted browser modes.
  }
};
