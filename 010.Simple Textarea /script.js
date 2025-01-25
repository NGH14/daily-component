window.onload = function () {
  const descriptionFieldPrimary = document.getElementById('description__primary--textarea');
  const errorMessage = document.getElementById('error_message');

  descriptionFieldPrimary.addEventListener('input', (event) => {
    const count = event.target.value.length;
    const countElement = document.getElementById('counter_current');
    countElement.textContent = event.target.value.length;

    if (count > 500) {
      descriptionFieldPrimary.classList.add('error');
      countElement.classList.add('error');
      errorMessage.style = 'visibility: visible';
    } else {
      descriptionFieldPrimary.classList.remove('error');  
      countElement.classList.remove('error');
      errorMessage.style = 'visibility: hidden';
    }
  });
}

