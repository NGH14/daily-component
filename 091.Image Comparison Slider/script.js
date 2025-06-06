document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.slider-container');
  document.querySelector('.slider').addEventListener('input', (e) => {
    container.style.setProperty('--indicator', `${e.target.value}%`);
  });
});
