const startMarker = '<!-- PROGRESS TABLE START -->';
const endMarker = '<!-- PROGRESS TABLE END -->';

export const tableRegex = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)\\n(${endMarker})`);