# Bento Grid

> A Bento Grid is a layout system that divides content into distinct, modular sections, similar to how a bento box divides food into compartments.

This challenge in CSS Grid and responsive skills with this [bento grid layout](https://www.frontendmentor.io/challenges/bento-grid-RMydElrlOj) in [frontendmentor](www.frontendmentor.io)

<video width="480" height="300" controls>
  <source src="screenshot.mp4" type="video/mp4">
</video>

![Image title](output.gif)

The key of the `Bento Grid` is the `grid-template-areas: <value>` in `display: grid`

```css
.container {
  display: grid;
  width: 100%;
  padding: 2rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 1.8rem;
  font-weight: var(--font-normal);
}

@media only screen and (min-width: 1400px) {
  .container {
    gap: 2rem;
    grid-template-areas:
      'box1 box2'
      'box3 box4'
      'box5 box6'
      'box7 box8';
  }
}
```
