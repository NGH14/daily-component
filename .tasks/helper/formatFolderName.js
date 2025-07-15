const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('./'); // or absolute path if needed

function formatWord(word) {
  // Preserve all-uppercase words
  if (word === word.toUpperCase()) return word;

  // Capitalize each part if hyphenated (e.g., focus-within -> Focus-Within)
  return word
    .split('-')
    .map(part =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join('-');
}

fs.readdirSync(baseDir, { withFileTypes: true }).forEach(dirent => {
  if (!dirent.isDirectory()) return;

  const originalName = dirent.name;
  const match = originalName.match(/^(\d{3}\.)(.*)/);
  if (!match) return;

  const prefix = match[1]; // e.g., "095."
  const namePart = match[2]; // e.g., "table focus-within"

  const formattedNamePart = namePart
    .split(' ')
    .map(word => {
      // If word starts with '(' and ends with ')', handle inside
      if (word.startsWith('(') && word.endsWith(')')) {
        const inner = word.slice(1, -1);
        return '(' + formatWord(inner) + ')';
      }

      // If word starts with '(' but doesn't end with ')'
      if (word.startsWith('(')) {
        const inner = word.slice(1);
        return '(' + formatWord(inner);
      }

      // If word ends with ')'
      if (word.endsWith(')')) {
        const inner = word.slice(0, -1);
        return formatWord(inner) + ')';
      }

      return formatWord(word);
    })
    .join(' ');

  const newName = prefix + formattedNamePart;

  if (newName !== originalName) {
    const oldPath = path.join(baseDir, originalName);
    const newPath = path.join(baseDir, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: "${originalName}" → "${newName}"`);
  }
});
