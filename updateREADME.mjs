import fs from 'fs';
import path from 'path';

export default function addProjectsToReadMe() {
  // Get all folders that match the pattern "###.Project Name"
  const folderPattern = /^(\d+)\.(.+)$/;
  const dirs = fs
    .readdirSync('.')
    .filter((file) => fs.statSync(file).isDirectory())
    .filter((dir) => folderPattern.test(dir));

  // Extract day numbers, project names, and file extensions
  const projects = dirs
    .map((dir) => {
      const match = dir.match(folderPattern);
      if (match) {
        const day = parseInt(match[1]);
        const projectName = match[2].trim();

        // Get all files in the project folder
        let fileExtensions = [];
        try {
          const files = fs.readdirSync(dir);
          // Extract unique file extensions
          fileExtensions = [
            ...new Set(
              files
                .map((file) => path.extname(file).toLowerCase())
                .filter((ext) => ext && ext.length > 1) // Filter out empty or single-char extensions
                .map((ext) => ext.substring(1)),
            ),
          ]; // Remove the dot
        } catch (err) {
          console.warn(`Could not read files in ${dir}: ${err.message}`);
        }

        return {
          day,
          folderName: dir,
          projectName,
          fileExtensions,
        };
      }
      return null;
    })
    .filter((project) => project !== null);

  // Sort projects by day number
  projects.sort((a, b) => a.day - b.day);

  // Read current README content
  if (!fs.existsSync('README.md')) {
    console.error('README.md does not exist. Please create it first.');
    return;
  }

  let readmeContent = fs.readFileSync('README.md', 'utf8');

  // Find the progress table in the README
  const tableRegex =
    /\| Day \| Component\s*\| Tags\s*\|\s*\n\|[-\s|]+\|\s*\n((?:\|[^\n]*\|\n)*)/;
  const tableMatch = readmeContent.match(tableRegex);

  if (!tableMatch) {
    console.error('Could not find the Progress table in README.md');
    return;
  }

  // Extract existing table rows
  const existingRows = tableMatch[1]
    .split('\n')
    .filter((row) => row.trim() !== '' && row.includes('|'));

  // Create rows for all projects with sorted file extension tags
  const newRows = projects.map((project) => {
    // Sort file extensions alphabetically and convert to uppercase
    let tags = project.fileExtensions
      .sort()
      .map((ext) => ext.toUpperCase())
      .join(', ');

    // If no extensions found, use a placeholder
    if (tags.length === 0) {
      tags = 'Folder Created';
    }

    return  `| ${project.day}  | ${project.projectName.padEnd(
      38,
      ' ',
    )} | ${tags.padEnd(30, ' ')} |`;
  });

  // Replace the entire table with the updated version
  const tableHeader = readmeContent.match(
    tableRegex,
  )[0];
  const updatedTable = tableHeader + '\n' + newRows.join('\n') + '\n';

  // Replace the old table with the updated one
  const updatedReadme = readmeContent.replace(tableRegex, updatedTable);

  // Write the updated content back to README.md
  fs.writeFileSync('README.md', updatedReadme);

  console.log(
    `README.md has been updated with ${projects.length} projects total.`,
  );
}

addProjectsToReadMe();
