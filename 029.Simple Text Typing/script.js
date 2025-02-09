document.addEventListener('DOMContentLoaded', function () {
 
  let i = 0;  
  let typing = document.getElementById('typing__text');
  const STRING = 'Simple Typing with setTimeout';
  const SPEED = 50;  


  function typeWriter() {
  
    if (!typing) {
      console.error('Could not find typing__text element!');
      return;
    }


    if (i < STRING.length) {
      typing.textContent += STRING.charAt(i);
      i++;

      setTimeout(typeWriter, SPEED);
    }
  }

  typeWriter();
});