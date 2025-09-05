import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import pcl from 'picocolors';

import addProjectsToReadMe from './updateREADME.mjs';
import createCSSTemplate from './template/templateCSS.mjs';
import createHTMLTemplate from './template/templateHTML.mjs';
import createJSTemplate from './template/templateJS.mjs';

import {
  PREFIX_NUMBER,
  WORKING_DIR,
  MAX_PROJECT_NAME_LENGTH,
  firstDayNumber,
} from './constants.mjs';

const banner = `
${pcl.cyan('┌─────────────────────────────────────┐')}
${pcl.cyan('│')}  ${pcl.bold(
  pcl.yellow('🚀 Project Generator CLI   '),
)}        ${pcl.cyan('│')}
${pcl.cyan('│')}  ${pcl.gray('Create new web projects instantly')}  ${pcl.cyan(
  '│',
)}
${pcl.cyan('└─────────────────────────────────────┘')}
`;

function findNextDayNumber() {
  const dayRegex = /^\d{3}\./;
  const dirs = fs
    .readdirSync(WORKING_DIR)
    .filter((file) => fs.statSync(file).isDirectory())
    .filter((dir) => dayRegex.test(dir));

  if (dirs.length === 0) {
    return firstDayNumber;
  }

  const dayNumbers = dirs
    .map((dir) => parseInt(dir.match(/\d{3}/)[0]))
    .filter((num) => !isNaN(num));

  const nextDay = Math.max(...dayNumbers) + 1;
  return nextDay.toString().padStart(PREFIX_NUMBER, '0');
}

function sanitizeProjectName(name) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function validateProjectName(input) {
  if (!input || input.trim().length === 0) {
    return 'Project name cannot be empty!';
  }
  if (input.trim().length > MAX_PROJECT_NAME_LENGTH) {
    return `Project name is too long (max ${MAX_PROJECT_NAME_LENGTH} characters)!`;
  }
  return true;
}

async function createNewProject() {
  console.clear();
  console.log(banner);

  const nextDay = findNextDayNumber();
  console.log(
    `${pcl.dim('→')} ${pcl.gray(
      `Next project number: ${pcl.cyan(`#${nextDay}`)}\n`,
    )}`,
  );

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: `What's project name?`,
        validate: validateProjectName,
        transformer: (input) => pcl.cyan(input),
        filter: sanitizeProjectName,
      },
      {
        type: 'confirm',
        name: 'includeJS',
        message: `Using JavaScript?`,
        default: false,
        transformer: (input) => (input ? pcl.green('Yes') : pcl.red('No')),
      },
      {
        type: 'list',
        name: 'template',
        message: `Choose a template style:`,
        choices: [
          {
            name: `${pcl.green('●')} Basic HTML5 Template`,
            value: 'basic',
          },
          {
            name: `${pcl.blue('●')} Modern CSS Grid Layout`,
            value: 'grid',
          },
          {
            name: `${pcl.magenta('●')} Flexbox Centered Layout`,
            value: 'flex',
          },
        ],
        default: 'basic',
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: (answers) => {
          const folderName = `${nextDay}.${answers.projectName}`;
          return `Create project "${pcl.cyan(folderName)}"?`;
        },
        default: true,
      },
    ]);

    if (!answers.confirm) {
      console.log(`\n${pcl.red('✖')} ${pcl.gray('Project creation cancelled.')}`);
      process.exit(0);
    }

    const { projectName, includeJS, template } = answers;
    const titleName = `Day #${nextDay}: ${projectName}`;
    const folderName = `${nextDay}.${projectName}`;

    console.log(`\n${pcl.cyan('⠋')} ${pcl.gray('Creating project...')}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    fs.mkdirSync(folderName);
    console.log(`${pcl.green('✔')} Created folder: ${pcl.cyan(folderName)}`);

    fs.writeFileSync(
      path.join(folderName, 'index.html'),
      createHTMLTemplate(titleName, includeJS, template),
    );
    console.log(`${pcl.green('✔')} Created ${pcl.cyan('index.html')}`);

    fs.writeFileSync(
      path.join(folderName, 'style.css'),
      createCSSTemplate(projectName, template),
    );
    console.log(`${pcl.green('✔')} Created ${pcl.cyan('style.css')}`);

    if (includeJS) {
      fs.writeFileSync(
        path.join(folderName, 'script.js'),
        createJSTemplate(projectName),
      );
      console.log(`${pcl.green('✔')} Created ${pcl.cyan('script.js')}`);
    }

    addProjectsToReadMe();
    console.log(`${pcl.green('✔')} Updated ${pcl.cyan('README.md')}`);

    console.log(`
${pcl.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${pcl.green('🎉 SUCCESS!')} Project ${pcl.bold(
      pcl.cyan(`#${nextDay}`),
    )} "${pcl.bold(pcl.yellow(projectName))}" created!

${pcl.dim('Next steps:')}
  ${pcl.dim('→')} ${pcl.cyan(`cd ${folderName}`)}
  ${pcl.dim('→')} Open ${pcl.cyan('index.html')} in your browser
  ${pcl.dim('→')} Start coding! ${pcl.yellow('✨')}

${pcl.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
    `);
  } catch (error) {
    if (error.isTtyError) {
      console.error(
        `${pcl.red('✖')} ${pcl.gray(
          "Prompt couldn't be rendered in the current environment",
        )}`,
      );
    } else if (error.name === 'ExitPromptError') {
      console.log(`\n${pcl.yellow('⚠')} ${pcl.gray('Operation cancelled.')}`);
    } else {
      console.error(
        `${pcl.red('✖')} ${pcl.gray('An error occurred:')} ${error.message}`,
      );
    }
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log(`\n${pcl.yellow('⚠')} ${pcl.gray('Process interrupted!')}`);
  process.exit(0);
});

createNewProject();
