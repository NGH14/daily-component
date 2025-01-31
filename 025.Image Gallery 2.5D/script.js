const imageContainer = document.getElementsByClassName("img__container");
const nextBtn = document.getElementById("btn__next");
const prevBtn = document.getElementById("btn__prev");

let x = 0;

prevBtn.onclick = () => {
  x = x + 45;
  rotate();
};

nextBtn.onclick = () => {
  x = x - 45;
  rotate();
};

function rotate() {
  imageContainer.style.transform = `perspective(1000px) rotateY(${x}deg)`;
}