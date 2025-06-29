# Google Input Style
> Reimplement the input that inspired Google's style 

The key concept in this style is moving or animation the label which relocated to the border of the input. 

```css
.form__input:focus ~ .form__label,
.form__input:not(:placeholder-shown) ~ .form__label {
	top: 0.2rem;
	font-size: 0.75rem;
	left: 3.5rem;
}
```
