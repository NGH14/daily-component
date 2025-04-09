import fs from 'fs';
import path from 'path';

/**
 * Creates a JSON file with project data and updates the README.md
 */
 function addProjectsToReadMe() {
  console.time('Total execution time');

  // Get all folders that match the pattern "###.Project Name"
  const folderPattern = /^(\d+)\.(.+)$/;
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
  // Extract project data
  const projects = dirs
    .map((dir) => {
      const match = dir.match(folderPattern);
      if (match) {
        const dayNumber = parseInt(match[1], 10);
        const projectName = match[2].trim();

        // Format the ID with leading zeros
        const id = dayNumber.toString().padStart(3, '0');

        // Get dates and file extensions in a single directory read to reduce I/O operations
        const { createdDate, modifiedDate, fileExtensions } = getProjectMetadata(dir);

        // Convert file extensions to technologies
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

        const tech = fileExtensions
          .map(ext => techMap[ext] || ext.toUpperCase())
          .sort()
          .join(', ');

        return {
          id,
          title: projectName,
          createdDate,
          modifiedDate,
          tech: tech || 'Folder Created',
          path: dir
        };
      }
      return null;
    })
    .filter((project) => project !== null);
  console.timeEnd('Processing projects');

  // Sort projects by ID
  projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // Save projects to JSON file
  console.time('Writing JSON');
  const jsonData = JSON.stringify(projects, null, 2);
  fs.writeFileSync('projects.json', jsonData);
  console.timeEnd('Writing JSON');
  console.log(`Created projects.json with ${projects.length} projects`);

  // Now update the README.md
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
    // Initialize with folder stats
    const folderStats = fs.statSync(dirPath);

    // Start with folder dates (use mtime as fallback if birthtime isn't available)
    let oldestTime = folderStats.birthtime && folderStats.birthtime.getTime() > 0
      ? folderStats.birthtime
      : folderStats.mtime;

    let newestTime = folderStats.mtime;
    let fileExtensions = new Set();

    try {
      const files = fs.readdirSync(dirPath);

      // Process all files in a single loop
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        try {
          // Get file stats
          const fileStats = fs.statSync(filePath);

          // Check for oldest time (creation)
          const fileCreateTime = fileStats.birthtime && fileStats.birthtime.getTime() > 0
            ? fileStats.birthtime
            : fileStats.mtime;

          if (fileCreateTime < oldestTime) {
            oldestTime = fileCreateTime;
          }

          // Check for newest time (modification)
          if (fileStats.mtime > newestTime) {
            newestTime = fileStats.mtime;
          }

          // Extract file extension if it's a file
          if (fileStats.isFile()) {
            const ext = path.extname(file).toLowerCase();
            if (ext && ext.length > 1) {
              fileExtensions.add(ext.substring(1)); // Remove the dot
            }
          }
        } catch (err) {
          // Skip files that can't be accessed
        }
      }
    } catch (err) {
      // If we can't read the directory, just use the folder date
    }

    // Format the dates as YYYY-MM-DD
    return {
      createdDate: oldestTime.toISOString().split('T')[0],
      modifiedDate: newestTime.toISOString().split('T')[0],
      fileExtensions: Array.from(fileExtensions)
    };
  } catch (err) {
    console.warn(`Could not get metadata for ${dirPath}: ${err.message}`);
    // Return current date as fallback
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

  // Define markers to locate the progress table section
  const startMarker = '<!-- PROGRESS TABLE START -->';
  const endMarker = '<!-- PROGRESS TABLE END -->';

  // Create a regex that captures everything between the markers
  const tableRegex = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)\\n(${endMarker})`);
  const tableMatch = readmeContent.match(tableRegex);

  if (!tableMatch) {
    console.error('Could not find the progress table markers in README.md');
    return;
  }

  // Build the header for the table
  const headerRows = `| Day | Component | Created | Last Modified | Tags |
|-----|-----------|---------|--------------|------|`;

  // Create rows for all projects
  const newRows = projects.map((project) => {
    // Create a Markdown link to the project folder
    const linkedProjectName = `[${project.title}](./${encodeURIComponent(project.path)})`;

    return `| ${parseInt(project.id)}  | ${linkedProjectName} | ${project.createdDate} | ${project.modifiedDate} | ${project.tech} |`;
  });

  // Build the updated table content with header and new rows
  const updatedTableContent =
    tableMatch[1] + headerRows + '\n' + newRows.join('\n') + '\n' + tableMatch[3];

  // Replace only the section between the markers
  const updatedReadme = readmeContent.replace(tableRegex, updatedTableContent);

  // Write the updated content back to README.md
  fs.writeFileSync(readmePath, updatedReadme);
  console.log(`README.md has been updated with ${projects.length} projects total.`);
}

// Check if projects.json exists and compare with filesystem
function checkForChanges() {
  try {
    if (fs.existsSync('projects.json')) {
      const existingData = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
      const folderPattern = /^(\d+)\.(.+)$/;

      // Get current directories
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

      // Get directories from JSON
      const jsonDirs = new Set(existingData.map(project => project.path));

      // Check for any differences
      const needsUpdate =
        currentDirs.size !== jsonDirs.size ||
        ![...currentDirs].every(dir => jsonDirs.has(dir)) ||
        ![...jsonDirs].every(dir => currentDirs.has(dir));

      if (!needsUpdate) {
        // No new folders, now check for modifications
        for (const project of existingData) {
          try {
            const stats = fs.statSync(project.path);
            const lastModifiedDate = stats.mtime.toISOString().split('T')[0];

            // If the modification date from stats is newer than what's in the JSON
            if (lastModifiedDate > project.modifiedDate) {
              return true; // Something was modified, needs update
            }
          } catch (err) {
            // If folder doesn't exist or can't be accessed, update is needed
            return true;
          }
        }

        console.log("No changes detected. Using existing projects.json");
        // Use existing data to update README
        updateReadMeFromJson(existingData);
        return false;
      }
    }
    return true; // Either no JSON file or changes detected
  } catch (err) {
    console.warn("Error checking for changes, will regenerate data:", err.message);
    return true;
  }
}

// Main execution
if (checkForChanges()) {
  addProjectsToReadMe();
} else {
  console.log("Using existing data - no changes detected");
}

export default addProjectsToReadMe;