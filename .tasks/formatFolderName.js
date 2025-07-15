
export function formatWord(word) {
  // Keep all-uppercase words like CSS, API
  if (word === word.toUpperCase()) return word;

  // Handle hyphenated words like focus-within
  return word
    .split('-')
    .map(part =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join('-');
}

export function formatFolderName(namePart) {
  return namePart
    .split(' ')
    .map(word => {
      // If word starts and ends with parentheses
      if (word.startsWith('(') && word.endsWith(')')) {
        const inner = word.slice(1, -1);
        return '(' + formatWord(inner) + ')';
      }

      // If only starts with '('
      if (word.startsWith('(')) {
        const inner = word.slice(1);
        return '(' + formatWord(inner);
      }

      // If only ends with ')'
      if (word.endsWith(')')) {
        const inner = word.slice(0, -1);
        return formatWord(inner) + ')';
      }

      return formatWord(word);
    })
    .join(' ');
}
