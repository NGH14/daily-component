# Rating Scale Component

A UI element designed to collect emotional feedback through three states.

- Happy (Green)
- Neutral (Yellow)
- Sad (Red)

## Main Idea

Using radio input button "under the hood"

```html
<label class="rating-component__label">
  <input
    type="radio"
    name="rating"
    class="rating-component__input rating-component__input--happy"
    id="rating-happy"
    value="happy"
  />
</label>
```

```css
.rating-component__label {
  position: relative;
}

.rating-component__input {
  position: absolute;
  opacity: 0;
}
```

Using modern CSS `is()` and `has()` for briefly the selector

**_Before_**

```css
.rating-component__input--sad:hover + .rating-component__icon,
.rating-component__input--sad:checked + .rating-component__icon,
.rating-component__input--sad:focus + .rating-component__icon {
  fill: hsl(7, 87.5%, 50%);
}
```

**_After_**

```css
.rating-component__input--sad:is(:hover, :checked, :focus)
  + .rating-component__icon {
  fill: hsl(0, 100%, 40%);
}
```
