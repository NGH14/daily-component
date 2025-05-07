# Carousel Slider (Infinite Mode)

> a slideshow for cycling through a series of content

The key of this carousel is `transform: translateX()`

```css
@keyframes scroll {
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}
```

and `overflow: hidden`

**note**: make sure there are at least 2 items (childs) in the animated elements to make the scroll smoothly.

<video width="460" height="180" controls>
  <source src="screenshot.mp4" type="video/mp4">
</video>
