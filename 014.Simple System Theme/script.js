// Constants for theme management
const THEME_STORAGE_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Get DOM elements once at startup
const themeToggleButton = document.querySelector('.theme__toggle--button');

function setTheme(theme) {
  document.documentElement.style.setProperty(
    '--theme-toggle-sun-icon-display',
    theme === LIGHT_THEME ? 'block' : 'none'
  );
  document.documentElement.style.setProperty(
    '--theme-toggle-moon-icon-display',
    theme === DARK_THEME ? 'block' : 'none'
  );

  document.documentElement.style.colorScheme = theme;

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getCurrentTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? LIGHT_THEME
    : DARK_THEME;
}

function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  setTheme(newTheme);
}

function initializeTheme() {
  setTheme(getCurrentTheme());

  themeToggleButton.addEventListener('click', toggleTheme);

  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    });
}

initializeTheme();
