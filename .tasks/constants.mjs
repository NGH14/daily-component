const startMarker = '<!-- PROGRESS TABLE START -->';
const endMarker = '<!-- PROGRESS TABLE END -->';

const tableMDRegex = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)\\n(${endMarker})`);
const PREFIX_NUMBER = 3; // Day format FolderName start 001
const WORKING_DIR = '.';
const MAX_PROJECT_NAME_LENGTH = 50;


export {tableMDRegex, startMarker, endMarker, PREFIX_NUMBER, WORKING_DIR, MAX_PROJECT_NAME_LENGTH};


