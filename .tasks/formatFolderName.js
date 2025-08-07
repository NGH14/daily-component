export function formatWord(word) {
  if (word === word.toUpperCase()) return word;

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
      if (word.startsWith('(') && word.endsWith(')')) {
        const inner = word.slice(1, -1);
        return '(' + formatWord(inner) + ')';
      }
      if (word.startsWith('(')) {
        const inner = word.slice(1);
        return '(' + formatWord(inner);
      }
      if (word.endsWith(')')) {
        const inner = word.slice(0, -1);
        return formatWord(inner) + ')';
      }

      return formatWord(word);
    })
    .join(' ');
}
