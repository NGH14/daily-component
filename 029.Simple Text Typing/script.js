let i = 0;
let typing = document.getElementById('typing__text');
const STRING = 'Simple Typing with setTimeout';
const SPEED = 1;

if (i < STRING.length) {
    typing.textContent += STRING.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
}