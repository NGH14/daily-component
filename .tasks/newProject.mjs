import fs from 'fs';
import path from 'path';
import readline from 'readline';
import addProjectsToReadMe from './updateREADME.mjs';

import { createCSSTemplate } from './template/templateCSS.mjs';
import { createHTMLTemplate } from './template/templateHTML.mjs';
import { createJSTemplate } from './template/templateJS.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prefixNumber = 3; // Formated as 001


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
  return nextDay.toString().padStart(prefixNumber, '0');
}

function createNewProject() {
  const nextDay = findNextDayNumber();

  rl.question('Enter a brief project name: ', (projectName) => {
    const sanitizedName = projectName
      .trim()
      .replace(/[^a-zA-Z0-9]/g, ' ')

    const formattedName = sanitizedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const titleName = `Day #${nextDay}: ${formattedName}`;


    const folderName = `${nextDay}.${formattedName}`;

    rl.question('Do you need JavaScript for this project? (y/N): ', (needJS) => {
      const includeJS = needJS.toLowerCase() === 'y';

      fs.mkdirSync(folderName);
      console.log(`Created folder: ${folderName}`);

      fs.writeFileSync(
        path.join(folderName, 'index.html'),
        createHTMLTemplate(titleName, includeJS)
      );
      console.log('Created index.html');

      fs.writeFileSync(
        path.join(folderName, 'style.css'),
        createCSSTemplate(formattedName)
      );
      console.log('Created style.css');

      if (includeJS) {
        fs.writeFileSync(
          path.join(folderName, 'script.js'),
          createJSTemplate(formattedName)
        );
        console.log('Created script.js');
      }

      addProjectsToReadMe();

      console.log(`\nProject #${nextDay} "${formattedName}" created successfully!`);
      console.log(`You can start working in the "${folderName}" folder.`);

      rl.close();
    });
  });
}

createNewProject();
