function countingUp(element, endValue = 100, duration = 1000) {
  let startTime = null;
  let currentNumber = 0;
  function animate(currentTime) {
    if (!startTime) {
      startTime = currentTime;
    }

    let progress = (currentTime - startTime) / duration;

    progress = Math.min(progress, 1);

    currentNumber = Math.floor(progress * endValue);

    element.textContent = currentNumber;
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

countingUp(document.getElementById('counting__number'), 500,3000);


