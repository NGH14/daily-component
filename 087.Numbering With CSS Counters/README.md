# [CSS Counter](https://www.google.com/search?client=firefox-b-d&q=CSS+Counter)

> CSS counters let you adjust the appearance of content based on its location in a document. For example, you can use counters to automatically number the headings on a webpage or to change the numbering on ordered lists.

<video width="480" height="300" controls>
  <source src="screenshot.mp4" type="video/mp4">
</video>

The implement step by step:

1. Set `counter-reset` in the parents element with the specific name, for example.

```css
main {
  counter-reset: section-chapter;
}
```

2. Set `counter-increment` the increment of counter.

```css
section {
  counter-increment: section-chapter 1;
}
```

3. Customize counter by modifi the content of `::before` pseudo-element with the `counters` function.

```css
span::before {
  content: counters(section-chapter, '.', decimal) '. ';
}
```

- ___[Predefined Counter Style in w3](https://www.w3.org/TR/predefined-counter-styles/)___
