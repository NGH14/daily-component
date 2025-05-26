document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tierForm');

  form.addEventListener('change', (event) => {
    if (event.target.name === 'tier') {
      console.log(`Selected tier: ${event.target.value}`);
    }
  });
});