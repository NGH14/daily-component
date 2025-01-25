document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.getElementById('dropdown');
  const dropdownToggle = dropdown.querySelector('.dropdown__toggle');
  const dropdownMenu = dropdown.querySelector('.dropdown__menu');
  const dropdownItems = dropdown.querySelectorAll('.dropdown__menu--item');

  function toggleDropdown() {
    const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
    dropdownToggle.setAttribute('aria-expanded', !isExpanded);
    dropdownMenu.classList.toggle('show');
  }

  function closeDropdown() {
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownMenu.classList.remove('show');
  }

  function selectItem(item) {
    dropdownItems.forEach((i) => {
      i.classList.remove('active');
      i.setAttribute('aria-selected', 'false');
    });
    item.classList.add('active');
    item.setAttribute('aria-selected', 'true');

    closeDropdown();
  }

  dropdownToggle.addEventListener('click', toggleDropdown);

  dropdownItems.forEach((item) => {
    item.addEventListener('click', () => selectItem(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        selectItem(item);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  });
 });