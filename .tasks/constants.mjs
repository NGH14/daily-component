const startMarker = '<!-- PROGRESS TABLE START -->';
const endMarker = '<!-- PROGRESS TABLE END -->';

const tableMDRegex = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)\\n(${endMarker})`);

export default tableMDRegex;


