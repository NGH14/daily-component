const cursorOutline = document.querySelector("#cursor_follower");

window.addEventListener("mousemove", (event) => {
  const posX = event.clientX;
  const posY = event.clientY;

  cursorOutline.style.top = `${posY}px`;
  cursorOutline.style.left = `${posX}px`;
});
