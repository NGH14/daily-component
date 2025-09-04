import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import pc from 'picocolors';

import addProjectsToReadMe from './updateREADME.mjs';
import createCSSTemplate from './template/templateCSS.mjs';
import createHTMLTemplate from './template/templateHTML.mjs';
import createJSTemplate from './template/templateJS.mjs';

import {
  PREFIX_NUMBER,
  WORKING_DIR,
  MAX_PROJECT_NAME_LENGTH,
} from './constants.mjs';

const banner = `
${pc.cyan('┌─────────────────────────────────────┐')}
${pc.cyan('│')}  ${pc.bold(
  pc.yellow('🚀 Project Generator CLI   '),
)}        ${pc.cyan('│')}
${pc.cyan('│')}  ${pc.gray('Create new web projects instantly')}  ${pc.cyan(
  '│',
)}
${pc.cyan('└─────────────────────────────────────┘')}
`;

function findNextDayNumber() {
  const dayRegex = /^\d{3}\./;
  const dirs = fs
    .readdirSync(WORKING_DIR)
    .filter((file) => fs.statSync(file).isDirectory())
    .filter((dir) => dayRegex.test(dir));

  if (dirs.length === 0) {
    return '001';
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
    `${pc.dim('→')} ${pc.gray(
      `Next project number: ${pc.cyan(`#${nextDay}`)}\n`,
    )}`,
  );

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: `What's project name?`,
        validate: validateProjectName,
        transformer: (input) => pc.cyan(input),
        filter: sanitizeProjectName,
      },
      {
        type: 'confirm',
        name: 'includeJS',
        message: `Using JavaScript?`,
        default: false,
        transformer: (input) => (input ? pc.green('Yes') : pc.red('No')),
      },
      {
        type: 'list',
        name: 'template',
        message: `Choose a template style:`,
        choices: [
          {
            name: `${pc.green('●')} Basic HTML5 Template`,
            value: 'basic',
          },
          {
            name: `${pc.blue('●')} Modern CSS Grid Layout`,
            value: 'grid',
          },
          {
            name: `${pc.magenta('●')} Flexbox Centered Layout`,
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
          return `Create project "${pc.cyan(folderName)}"?`;
        },
        default: true,
      },
    ]);

    if (!answers.confirm) {
      console.log(`\n${pc.red('✖')} ${pc.gray('Project creation cancelled.')}`);
      process.exit(0);
    }

    const { projectName, includeJS, template } = answers;
    const titleName = `Day #${nextDay}: ${projectName}`;
    const folderName = `${nextDay}.${projectName}`;

    console.log(`\n${pc.cyan('⠋')} ${pc.gray('Creating project...')}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    fs.mkdirSync(folderName);
    console.log(`${pc.green('✔')} Created folder: ${pc.cyan(folderName)}`);

    fs.writeFileSync(
      path.join(folderName, 'index.html'),
      createHTMLTemplate(titleName, includeJS, template),
    );
    console.log(`${pc.green('✔')} Created ${pc.cyan('index.html')}`);

    fs.writeFileSync(
      path.join(folderName, 'style.css'),
      createCSSTemplate(projectName, template),
    );
    console.log(`${pc.green('✔')} Created ${pc.cyan('style.css')}`);

    if (includeJS) {
      fs.writeFileSync(
        path.join(folderName, 'script.js'),
        createJSTemplate(projectName),
      );
      console.log(`${pc.green('✔')} Created ${pc.cyan('script.js')}`);
    }

    addProjectsToReadMe();
    console.log(`${pc.green('✔')} Updated ${pc.cyan('README.md')}`);

    console.log(`
${pc.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${pc.green('🎉 SUCCESS!')} Project ${pc.bold(
      pc.cyan(`#${nextDay}`),
    )} "${pc.bold(pc.yellow(projectName))}" created!

${pc.dim('Next steps:')}
  ${pc.dim('→')} ${pc.cyan(`cd ${folderName}`)}
  ${pc.dim('→')} Open ${pc.cyan('index.html')} in your browser
  ${pc.dim('→')} Start coding! ${pc.yellow('✨')}

${pc.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
    `);
  } catch (error) {
    if (error.isTtyError) {
      console.error(
        `${pc.red('✖')} ${pc.gray(
          "Prompt couldn't be rendered in the current environment",
        )}`,
      );
    } else if (error.name === 'ExitPromptError') {
      console.log(`\n${pc.yellow('⚠')} ${pc.gray('Operation cancelled.')}`);
    } else {
      console.error(
        `${pc.red('✖')} ${pc.gray('An error occurred:')} ${error.message}`,
      );
    }
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log(`\n${pc.yellow('⚠')} ${pc.gray('Process interrupted!')}`);
  process.exit(0);
});

createNewProject();
