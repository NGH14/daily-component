const fs = require('fs');
const path = require('path');

// Folder where your projects are stored
const baseDir = path.resolve('./'); // or specify absolute path

// Read all folders
fs.readdirSync(baseDir, { withFileTypes: true }).forEach(dirent => {
  if (!dirent.isDirectory()) return;

  const originalName = dirent.name;

  // Skip if the folder doesn't start with a 3-digit prefix
  if (!/^\d{3}\./.test(originalName)) return;

  const formattedName = originalName
    .split(' ')
    .map(word => {
      return word === word.toUpperCase()
        ? word // keep full uppercase like CSS
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  // Only rename if there's a change
  if (formattedName !== originalName) {
    const oldPath = path.join(baseDir, originalName);
    const newPath = path.join(baseDir, formattedName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: "${originalName}" → "${formattedName}"`);
  }
});