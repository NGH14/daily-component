  function togglePrimary(isPremium, element) {
    const wrapper = element.closest('.toggle-wrapper');
    const freeOption = wrapper.querySelector('.option-free');

    if (isPremium) {
      wrapper.classList.add('premium');
      freeOption.classList.remove('active');
    } else {
      wrapper.classList.remove('premium');
      wrapper.classList.remove('team');
      freeOption.classList.add('active');
    }
  }

  function toggleSecondary(isSolo, element) {
    const wrapper = element.closest('.toggle-wrapper');
    const secondaryOptions = wrapper.querySelectorAll('.secondary-option');

    secondaryOptions.forEach((option) => option.classList.remove('active'));
    element.classList.add('active');

    if (!isSolo) {
      wrapper.classList.remove('team');
    } else {
      wrapper.classList.add('team');
    }
  }

