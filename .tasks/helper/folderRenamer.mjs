import fs from 'fs';
import path from 'path';
import { formatWord, formatFolderName } from '../formatFolderName.js';

const baseDir = path.resolve('./');

fs.readdirSync(baseDir, { withFileTypes: true }).forEach(fileEntry => {
  if (!fileEntry.isDirectory()) return console.log(`Skipping non-directory: ${fileEntry.name}`);

  const originalName = fileEntry.name;
  const match = originalName.match(/^(\d{3}\.)(.*)/);
  if (!match) return;

  const dayNumberPrefix = match[1];
  const namePart = match[2];

  const formattedNamePart = formatFolderName(namePart);

  const newNamePart = prefix + formattedNamePart;

  if (newNamePart !== originalName) {
    const oldPath = path.join(baseDir, originalName);
    const newPath = path.join(baseDir, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: "${originalName}" → "${newName}"`);
  }
  else {
    console.log(`No change needed for: ${originalName}`);
  }
});
