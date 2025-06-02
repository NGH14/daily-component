# Placeholder For Broken Image

> An image placeholder is a dummy image designed to draw attention to the need for an actual image when link broken.

There are the first solution ofr placeholder broken image link with `Javascript` in [`Day #77: Image On Error Placeholder`](../001.Simple%20Validate%20Form%20with%20Vanilla%20JS/index.html)

The key of the image placeholder is `::after` creates a [`pseudo-element`](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements), with the [`attr()`](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) CSS function is used to retrieve the value of an attribute of the selected element and use it in a property value.

The main reason using the `::after` instead of `::before` is some brownser like Firefox take the `::before` in `img` tag to show the `alt` content when image link broken.

```css
img {
  display: block;
  margin-block: 1em;
  width: 100%;
  height: 300px;

  object-fit: cover;
  position: relative;

  border-radius: 30px;

  &::before {
    color: transparent;
  }
  &::after {
    position: absolute;
    content: 'Fail to load the \A'attr(alt) ' image';
    inset: 0;
    display: grid;
    place-items: center;
    text-align: center;
    background: transparent;
    border: 2px dashed currentColor;
    font: bold 1.6em/1.5 system-ui;
    white-space: pre-wrap;
    color: hsla(0, 39%, 49%, 0.894);
  }
}
```

_Content ref: https://vinpearl.com/en/bun-bo-hue-noodles-beloved-vietnamese-dish_