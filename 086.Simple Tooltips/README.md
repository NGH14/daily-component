# [Tooltips](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tooltip_role)

> A tooltip is a contextual text bubble that displays a description for an element that appears on pointer hover or keyboard focus.

<video width="480" height="300" controls>
  <source src="screenshot.mp4" type="video/mp4">
</video>

The key of this tooltips component is `position: absolute` also with the technique implement the simple arrow by the `border`.

```css
.tooltip__arrow {
  position: absolute;
  bottom: calc(-1*var(--arrow-size));
  left: 50%;
  transform: translateX(-50%);
  width: 0px;
  height: 0px;
  border-right: var(--arrow-size) solid transparent;
  border-left: var(--arrow-size) solid transparent;
  border-top: var(--arrow-size) solid rgba(255, 255, 255, 0.3);
}
```

The pile of arrow are defined as the symmetrical value, for example:

- __The `arrow up`__ have the `border-bottom` as the color of the arrow and two others side will `transparent`

```css
border-left: 9px solid transparent;
border-right: 9px solid transparent;
border-bottom: 9px solid black;
```

- __The `arrow down`__ have the `border-top` as the color of the arrow and two others side will `transparent`

```css
border-left: 9px solid transparent;
border-right: 9px solid transparent;
border-top: 9px solid black;
```

- __The `arrow right`__ have the `border-left` as the color of the arrow and two others side will `transparent`

```css
border-top: 9px solid transparent;
border-bottom: 9px solid transparent;
border-left: 9px solid black;
```

- __The `arrow left`__ have the `border-right` as the color of the arrow and two others side will `transparent`

```css
border-top: 9px solid transparent;
border-botoom: 9px solid transparent;
border-right: 9px solid black;
```

___Do not forget to set the `width:0` and `height:0`___

