import fs from 'fs';
import path from 'path';
import readline from 'readline';
import addProjectsToReadMe from './updateREADME.mjs';

import { createCssTemplate } from './template/templateCSS.mjs';
import { createHtmlTemplate } from './template/templateHTML.mjs';
import { createJsTemplate } from './template/templateJS.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function findNextDayNumber() {
  const dayRegex = /^\d{3}\./;
  const dirs = fs.readdirSync('.')
    .filter(file => fs.statSync(file).isDirectory())
    .filter(dir => dayRegex.test(dir));

  if (dirs.length === 0) {
    return '001';
  }

  const dayNumbers = dirs
    .map(dir => parseInt(dir.match(/\d{3}/)[0]))
    .filter(num => !isNaN(num));

  const nextDay = Math.max(...dayNumbers) + 1;
  return nextDay.toString().padStart(3, '0');
}

// Main function to create a new project
function createNewProject() {
  const nextDay = findNextDayNumber();

  rl.question('Enter a brief project name (one or two words): ', (projectName) => {
    // Trim and remove any non-alphanumeric characters
    const sanitizedName = projectName
      .trim()
      .replace(/[^a-zA-Z0-9]/g, ' ')

    // Format project name for display (capitalize first letter)
    const formattedName = sanitizedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const titleName = `Day #${nextDay}: ${formattedName}`;


    // Create folder name with padded day number and sanitized project name
    const folderName = `${nextDay}.${formattedName}`;

    rl.question('Do you need JavaScript for this project? (y/N): ', (needJS) => {
      const includeJS = needJS.toLowerCase() === 'y';

      // Create the folder
      fs.mkdirSync(folderName);
      console.log(`Created folder: ${folderName}`);

      // Create and write HTML file
      fs.writeFileSync(
        path.join(folderName, 'index.html'),
        createHtmlTemplate(titleName, includeJS)
      );
      console.log('Created index.html');

      // Create and write CSS file
      fs.writeFileSync(
        path.join(folderName, 'style.css'),
        createCssTemplate(formattedName)
      );
      console.log('Created style.css');

      // Create and write JS file if needed
      if (includeJS) {
        fs.writeFileSync(
          path.join(folderName, 'script.js'),
          createJsTemplate(formattedName)
        );
        console.log('Created script.js');
      }

      // Update README with new project
      addProjectsToReadMe();

      console.log(`\nProject #${nextDay} "${formattedName}" created successfully!`);
      console.log(`You can start working in the "${folderName}" folder.`);

      rl.close();
    });
  });
}

createNewProject();