import fs from 'fs';
import path from 'path';
import { formatWord, formatFolderName } from '../formatFolderName.js';

const baseDir = path.resolve('./');

fs.readdirSync(baseDir, { withFileTypes: true }).forEach(dirent => {
  if (!dirent.isDirectory()) return console.log(`Skipping non-directory: ${dirent.name}`);

  const originalName = dirent.name;
  const match = originalName.match(/^(\d{3}\.)(.*)/);
  if (!match) return;

  const prefix = match[1]; // e.g., "095."
  const namePart = match[2]; // e.g., "table focus-within"

  const formattedNamePart = formatFolderName(namePart);

  const newName = prefix + formattedNamePart;

  if (newName !== originalName) {
    const oldPath = path.join(baseDir, originalName);
    const newPath = path.join(baseDir, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: "${originalName}" → "${newName}"`);
  }

  // If the folder name is already formatted correctly, skip renaming
  else {
    console.log(`No change needed for: ${originalName}`);
  }
});
