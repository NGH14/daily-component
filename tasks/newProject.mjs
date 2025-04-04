import fs from 'fs';
import path from 'path';
import readline from 'readline';
import addProjectsToReadMe from './updateREADME.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// HTML template with proper linking for CSS and optional JS
function createHtmlTemplate(projectName, includeJS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="style.css">
  ${includeJS ? '<script src="script.js" defer></script>' : ''}
</head>
<body>
  <h1>${projectName}</h1>
  <div class="container">
    <!-- Your content here -->
  </div>
</body>
</html>`;
}

// CSS template
function createCssTemplate(projectName) {
  return `/* ${projectName} Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  line-height: 1.6;
  padding: 20px;
}
`;
}

// JS template
function createJsTemplate(projectName) {
  return `// ${projectName} JavaScript
document.addEventListener('DOMContentLoaded', () => {
  console.log('${projectName} loaded!');
  // Your code here
});
`;
}

// Function to find the next day number
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
      .toLowerCase();

    // Format project name for display (capitalize first letter)
    const formattedName = sanitizedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');


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
        createHtmlTemplate(formattedName, includeJS)
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