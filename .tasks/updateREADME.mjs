import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import pcl from 'picocolors';
import { fileURLToPath } from 'url';

import { START_MARKER, END_MARKER, HEADER_ROWS } from './constants.mjs';

const banner = `
  ${pcl.bold(pcl.yellow('🚀 README and Project Updater'))}
  ${pcl.gray('Synchronize projects.json and README.md')}
`;

const folderPattern = /^(\d+)\.(.+)$/;
const ID_PADDING_LENGTH = 3;
const PADDING_CHAR = '0';

function getProjectMetadata(dirPath) {
  try {
    const folderStats = fs.statSync(dirPath);
    let oldestTime =
      folderStats.birthtime && folderStats.birthtime.getTime() > 0
        ? folderStats.birthtime
        : folderStats.mtime;
    let newestTime = folderStats.mtime;

    try {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        try {
          const fileStats = fs.statSync(filePath);
          const fileCreateTime =
            fileStats.birthtime && fileStats.birthtime.getTime() > 0
              ? fileStats.birthtime
              : fileStats.mtime;
          if (fileCreateTime < oldestTime) oldestTime = fileCreateTime;
          if (fileStats.mtime > newestTime) newestTime = fileStats.mtime;
        } catch (err) {
          console.warn(
            pcl.yellow(
              `Could not read file stats for ${filePath}: ${err.message}`,
            ),
          );
        }
      }
    } catch (err) {
      console.warn(
        pcl.yellow(
          `Could not read directory stats for ${dirPath}: ${err.message}`,
        ),
      );
    }
    return {
      createdDate: oldestTime.toISOString().split('T')[0],
      modifiedDate: newestTime.toISOString().split('T')[0],
    };
  } catch (err) {
    console.warn(
      pcl.yellow(`Could not get metadata for ${dirPath}: ${err.message}`),
    );
    const now = new Date();
    return {
      createdDate: now.toISOString().split('T')[0],
      modifiedDate: now.toISOString().split('T')[0],
    };
  }
}

function addProjectsToReadMe(verbose = false) {
  if (verbose) {
    console.log(`
${pcl.cyan('⠋')} ${pcl.gray('Updating project list...')}`);
  }

  const dirs = fs
    .readdirSync('.')
    .filter(
      (file) =>
        fs.existsSync(file) &&
        fs.statSync(file).isDirectory() &&
        folderPattern.test(file),
    );

  const projects = dirs
    .map((dir) => {
      const match = dir.match(folderPattern);
      if (!match) return null;
      const dayNumber = parseInt(match[1], 10);
      const projectName = match[2].trim();
      const id = dayNumber.toString().padStart(ID_PADDING_LENGTH, PADDING_CHAR);
      const { createdDate, modifiedDate } = getProjectMetadata(dir);
      return { id, title: projectName, createdDate, modifiedDate, path: dir };
    })
    .filter(Boolean);

  projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2));
  if (verbose) {
    console.log(
      `${pcl.green('✔')} Updated ${pcl.cyan('projects.json')} with ${
        projects.length
      } projects.`,
    );
  }

  updateReadMeFromJson(projects, verbose);
}

function updateReadMeFromJson(projects, verbose = false) {
  const readmePath = 'README.md';
  if (!fs.existsSync(readmePath)) {
    console.error(pcl.red('✖ README.md not found.'));
    return;
  }

  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  const tableRegex = new RegExp(
    `(${START_MARKER}\n)([\s\S]*?)\n(${END_MARKER})`,
  );
  const tableMatch = readmeContent.match(tableRegex);

  if (!tableMatch) {
    console.error(pcl.red('✖ README markers not found.'));
    return;
  }

  const newRows = projects.map(
    (p) =>
      `| ${parseInt(p.id)} | [${p.title}](./${encodeURIComponent(p.path)}) | ${
        p.createdDate
      } | ${p.modifiedDate} |`,
  );
  const updatedTable = `${tableMatch[1]}${HEADER_ROWS}
${newRows.join('\n')}
${tableMatch[3]}`;
  fs.writeFileSync(readmePath, readmeContent.replace(tableRegex, updatedTable));

  if (verbose) {
    console.log(`${pcl.green('✔')} Updated ${pcl.cyan('README.md')}.`);
  }
}

function checkForChanges() {
  if (!fs.existsSync('projects.json')) {
    return 'PROJECTS_JSON_MISSING';
  }

  try {
    const existingData = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
    const currentDirs = new Set(
      fs
        .readdirSync('.')
        .filter(
          (file) =>
            fs.existsSync(file) &&
            fs.statSync(file).isDirectory() &&
            folderPattern.test(file),
        ),
    );

    const jsonDirs = new Set(existingData.map((p) => p.path));

    if (
      currentDirs.size !== jsonDirs.size ||
      ![...currentDirs].every((dir) => jsonDirs.has(dir))
    ) {
      return 'DIRECTORY_MISMATCH';
    }

    for (const project of existingData) {
      const { modifiedDate } = getProjectMetadata(project.path);
      if (modifiedDate !== project.modifiedDate) {
        console.log(
          `${pcl.yellow('!')} Changes detected in ${pcl.cyan(project.path)}.`,
        );
        return 'FILE_MODIFIED';
      }
    }
  } catch (error) {
    return 'METADATA_ERROR';
  }

  return 'NO_CHANGES';
}

async function runCli() {
  console.clear();
  console.log(banner);

  const force = process.argv.includes('--force');
  if (force) {
    console.log(
      `${pcl.yellow('!')} ${pcl.gray('Force update flag detected.')}`,
    );
  }

  const changeStatus = checkForChanges();
  const needsUpdate = force || changeStatus !== 'NO_CHANGES';

  if (needsUpdate) {
    let message = 'Proceed with update?';
    switch (changeStatus) {
      case 'PROJECTS_JSON_MISSING':
        message = `${pcl.yellow(
          'projects.json not found.',
        )} Create it and update README?`;
        break;
      case 'DIRECTORY_MISMATCH':
        message = `${pcl.yellow(
          'Directory structure has changed.',
        )} Update projects and README?`;
        break;
      case 'FILE_MODIFIED':
        message = `${pcl.yellow(
          'Project modification dates have changed.',
        )} Update projects and README?`;
        break;
      case 'METADATA_ERROR':
        message = `${pcl.red('Error reading project metadata.')} Force update?`;
        break;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message,
        default: true,
      },
    ]);

    if (confirm) {
      addProjectsToReadMe(true);
      console.log(`
${pcl.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${pcl.green('🎉 SUCCESS!')} ${pcl.bold(pcl.white('Update complete!'))}
${pcl.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
      `);
    } else {
      console.log(`
${pcl.red('✖')} ${pcl.gray('Update cancelled.')}`);
      process.exit(0);
    }
  } else {
    console.log(`
${pcl.green('✔')} ${pcl.gray('No changes detected. Nothing to do.')}`);
  }
}

export default addProjectsToReadMe;

const isCLI = fileURLToPath(import.meta.url) === process.argv[1];

async function main() {
  try {
    await runCli();
  } catch (error) {
    if (error.isTtyError) {
      console.error(
        `${pcl.red('✖')} ${pcl.gray(
          "Prompt couldn't be rendered in the current environment",
        )}`,
      );
    } else {
      console.error(
        `${pcl.red('✖')} ${pcl.gray('An error occurred:')} ${error.message}`,
      );
    }
    process.exit(1);
  }
}

if (isCLI) {
  main();
}
