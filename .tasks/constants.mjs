const START_MARKER = '<!-- PROGRESS TABLE START -->';
const END_MARKER = '<!-- PROGRESS TABLE END -->';

const TABLE_MD_REGEX = new RegExp(
  `(${START_MARKER}\\n)([\\s\\S]*?)\\n(${END_MARKER})`,
);

const HEADER_ROWS = `| Day | Component | Created | Last Modified |
|-----|-----------|---------|--------------|`;

const PREFIX_NUMBER = 3; // Day format FolderName start 001
const FIRST_DAY_NUMBER = '001';
const WORKING_DIR = '.';
const MAX_PROJECT_NAME_LENGTH = 50;

export {
  TABLE_MD_REGEX,
  START_MARKER,
  END_MARKER,
  HEADER_ROWS,
  PREFIX_NUMBER,
  WORKING_DIR,
  MAX_PROJECT_NAME_LENGTH,
  FIRST_DAY_NUMBER,
};
