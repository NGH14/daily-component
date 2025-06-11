# [Image Comparison Slider (Vertical)](https://www.w3schools.com/howto/howto_js_image_comparison.asp)

> Image Compare Slider is visually compare two images by overlaying them and using a slider to reveal differences. It's perfect for before-and-after comparisons, design verification, and identifying subtle changes between images.

The key concept of this image comparison is match the position of the slider with the `clip-path` in two image that stack exactly together. Make sure using the `clip-path` instead of `height` that help bug free in case the ratio's image difference with the parent container.

<video width="480" height="300" controls>
  <source src="screenshot.mp4" type="video/mp4">
</video>

![Image title](output.gif)

```css
.slider-container {
  --position: 50%;
  writing-mode: vertical-lr;
  display: grid;
  place-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
}

.image-container {
  max-width: 600px;
  height: 60vh;
}

.slider-image {
  width: 100%;
  height: 100%;
}

.image-before {
  position: absolute;
  inset: 0;
  clip-path: inset(0 0 calc(100% - var(--position)) 0);
  filter: grayscale(100%);
}

.slider-input {
  position: absolute;
  inset: 0;
  cursor: grab;
  opacity: 0;
  width: 100%;
  height: 100%;
}

.slider:focus-visible ~ .slider-button {
  outline: 5px solid black;
  outline-offset: 3px;
}

.slider-line {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 0.2rem;
  background-color: hsl(0, 0%, 80%);
  top: var(--position);
  transform: translateY(-50%);
  pointer-events: none;
}

.slider-button {
  position: absolute;
  background-color: hsl(0, 0%, 100%);
  color: hsl(300, 15%, 8%);

  padding: 0.25rem;
  border-radius: 100px;

  display: grid;
  place-items: center;
  left: 50%;
  top: var(--position);
  transform: translate(-40%, -50%);

  pointer-events: none;
  box-shadow: 1px 1px 1px hsl(0, 50%, 2%, 0.5);
  svg {
    rotate: 90deg;
  }
}
```

```js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.slider-container');
  document.querySelector('.slider-input').addEventListener('input', (e) => {
    container.style.setProperty('--position', `${e.target.value}%`);
  });
});
```

- The horizontal version in the next day project [Day #91](../091.Horizontal%20Image%20Comparison%20Slider/)
- svg ref: https://www.svgrepo.com/svg/488904/drag-handle-horizontal
