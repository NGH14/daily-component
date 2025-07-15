const startMarker = '<!-- PROGRESS TABLE START -->';
const endMarker = '<!-- PROGRESS TABLE END -->';

export const tableMDRegex = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)\\n(${endMarker})`);



