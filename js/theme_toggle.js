// Theme toggle for pages that include .theme-toggle button
(function () {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (icon) icon.classList.replace('fa-sun', 'fa-moon');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      if (icon) icon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (icon) icon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });
})();
