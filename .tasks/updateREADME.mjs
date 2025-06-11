import fs from 'fs';
import path from 'path';

/**
 * Creates a JSON file with project data and updates the README.md
 */
function addProjectsToReadMe() {
  console.time('Total execution time');

  const folderPattern = /^(\d+)\.(.+)$/;
  const ID_PADDING_LENGTH = 3;
  const PADDING_CHAR = '0';
  console.time('Reading directories');
  const dirs = fs
    .readdirSync('.')
    .filter((file) => {
      try {
        return fs.statSync(file).isDirectory();
      } catch (err) {
        return false;
      }
    })
    .filter((dir) => folderPattern.test(dir));
  console.timeEnd('Reading directories');

  console.time('Processing projects');
  const projects = dirs
    .map((dir) => {
      const match = dir.match(folderPattern);
      if (match) {
        const dayNumber = parseInt(match[1], 10);
        const projectName = match[2].trim();

        const id = dayNumber.toString().padStart(ID_PADDING_LENGTH, PADDING_CHAR);

        const { createdDate, modifiedDate, fileExtensions } = getProjectMetadata(dir);

        const techMap = {
          'html': 'HTML',
          'css': 'CSS',
          'js': 'JavaScript',
          'jsx': 'React',
          'tsx': 'React/TypeScript',
          'ts': 'TypeScript',
          'vue': 'Vue',
          'svelte': 'Svelte',
          'py': 'Python',
          'json': 'JSON',
          'md': 'Markdown',
          'php': 'PHP',
          'scss': 'SCSS',
          'sass': 'Sass',
          'less': 'Less',
          'go': 'Go',
          'rb': 'Ruby',
          'java': 'Java',
          'c': 'C',
          'cpp': 'C++',
          'cs': 'C#',
          'sh': 'Shell',
          'sql': 'SQL',
          'swift': 'Swift',
          'kt': 'Kotlin',
          'rs': 'Rust'
        };

        // Filter out non-technical extensions
        const technicalExtensions = fileExtensions.filter(ext => techMap.hasOwnProperty(ext));

        const tech = technicalExtensions.length > 0
          ? technicalExtensions
            .map(ext => techMap[ext])
            .sort()
            .join(', ')
          : 'Folder Created';

        return {
          id,
          title: projectName,
          createdDate,
          modifiedDate,
          tech,
          path: dir
        };
      }
      return null;
    })
    .filter((project) => project !== null);
  console.timeEnd('Processing projects');

  projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  console.time('Writing JSON');
  const jsonData = JSON.stringify(projects, null, 2);
  fs.writeFileSync('projects.json', jsonData);
  console.timeEnd('Writing JSON');
  console.log(`Created projects.json with ${projects.length} projects`);

  console.time('Updating README');
  updateReadMeFromJson(projects);
  console.timeEnd('Updating README');

  console.timeEnd('Total execution time');
}

/**
 * Gets metadata (dates and file extensions) for a project folder in a single pass
 * @param {string} dirPath - The path to the directory
 * @returns {Object} - Object containing createdDate, modifiedDate, and fileExtensions
 */
function getProjectMetadata(dirPath) {
  try {
    const folderStats = fs.statSync(dirPath);

    let oldestTime = folderStats.birthtime && folderStats.birthtime.getTime() > 0
      ? folderStats.birthtime
      : folderStats.mtime;

    let newestTime = folderStats.mtime;
    let fileExtensions = new Set();

    try {
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        try {
          const fileStats = fs.statSync(filePath);

          const fileCreateTime = fileStats.birthtime && fileStats.birthtime.getTime() > 0
            ? fileStats.birthtime
            : fileStats.mtime;

          if (fileCreateTime < oldestTime) {
            oldestTime = fileCreateTime;
          }

          if (fileStats.mtime > newestTime) {
            newestTime = fileStats.mtime;
          }

          if (fileStats.isFile()) {
            const ext = path.extname(file).toLowerCase().slice(1); // Remove the dot
            if (ext && ext.length > 0) {
              fileExtensions.add(ext);
            }
          }
        } catch (err) {
          // Skip files that can't be accessed
        }
      }
    } catch (err) {
      // Skip directories that can't be read
    }

    return {
      createdDate: oldestTime.toISOString().split('T')[0],
      modifiedDate: newestTime.toISOString().split('T')[0],
      fileExtensions: Array.from(fileExtensions)
    };
  } catch (err) {
    console.warn(`Could not get metadata for ${dirPath}: ${err.message}`);
    const now = new Date();
    return {
      createdDate: now.toISOString().split('T')[0],
      modifiedDate: now.toISOString().split('T')[0],
      fileExtensions: []
    };
  }
}

/**
 * Updates the README.md file using the project data
 */
function updateReadMeFromJson(projects) {
  const readmePath = 'README.md';
  if (!fs.existsSync(readmePath)) {
    console.error('README.md does not exist. Please create it first.');
    return;
  }

  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  const startMarker = '<!-- PROGRESS TABLE START -->';
  const endMarker = '<!-- PROGRESS TABLE END -->';

  const tableRegex = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)\\n(${endMarker})`);
  const tableMatch = readmeContent.match(tableRegex);

  if (!tableMatch) {
    console.error('Could not find the progress table markers in README.md');
    return;
  }

  const headerRows = `| Day | Component | Created | Last Modified | Tags |
|-----|-----------|---------|--------------|------|`;

  const newRows = projects.map((project) => {
    const linkedProjectName = `[${project.title}](./${encodeURIComponent(project.path)})`;

    return `| ${parseInt(project.id)}  | ${linkedProjectName} | ${project.createdDate} | ${project.modifiedDate} | ${project.tech} |`;
  });

  const updatedTableContent =
    tableMatch[1] + headerRows + '\n' + newRows.join('\n') + '\n' + tableMatch[3];

  const updatedReadme = readmeContent.replace(tableRegex, updatedTableContent);

  fs.writeFileSync(readmePath, updatedReadme);
  console.log(`README.md has been updated with ${projects.length} projects total.`);
}

function checkForChanges() {
  try {
    if (fs.existsSync('projects.json')) {
      const existingData = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
      const folderPattern = /^(\d+)\.(.+)$/;

      const currentDirs = new Set(
        fs.readdirSync('.')
          .filter(file => {
            try {
              return fs.statSync(file).isDirectory();
            } catch (err) {
              return false;
            }
          })
          .filter(dir => folderPattern.test(dir))
      );

      const jsonDirs = new Set(existingData.map(project => project.path));

      // Check if directories have changed
      const needsUpdate =
        currentDirs.size !== jsonDirs.size ||
        ![...currentDirs].every(dir => jsonDirs.has(dir)) ||
        ![...jsonDirs].every(dir => currentDirs.has(dir));

      if (needsUpdate) {
        console.log("Directory changes detected, updating...");
        return true;
      }

      // Check if any project folder has been modified
      for (const project of existingData) {
        try {
          const { modifiedDate } = getProjectMetadata(project.path);
          if (modifiedDate > project.modifiedDate) {
            console.log(`Changes detected in ${project.path}, updating...`);
            return true;
          }
        } catch (err) {
          console.log(`Error checking ${project.path}, will update...`);
          return true;
        }
      }

      console.log("No changes detected. Using existing projects.json");
      updateReadMeFromJson(existingData);
      return false;
    }

    // If projects.json doesn't exist, we need to create it
    console.log("projects.json not found, creating...");
    return true;
  } catch (err) {
    console.warn("Error checking for changes, will regenerate data:", err.message);
    return true;
  }
}

if (checkForChanges()) {
  addProjectsToReadMe();
} else {
  console.log("Using existing data - no changes detected");
}

export default addProjectsToReadMe;