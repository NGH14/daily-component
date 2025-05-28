# [Radio Button](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)

> <input> elements of type radio are generally used in radio groups—collections of radio buttons describing a set of related options.

<video width="480" height="300" controls>
  <source src="screenshot.mp4" type="video/mp4">
</video>

The key of nested toggle button is `transform: translateX(<value>)` of the button indicator or slider (`.toggle__indicator`) that show the selected state.

Also the supported of the screen reader element (`.sr-only`).

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border-width: 0;
}
```
