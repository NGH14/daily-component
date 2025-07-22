// JS template
export function createJSTemplate(projectName) {
  return `
document.addEventListener('DOMContentLoaded', () => {
  console.log('${projectName} loaded!');
});
`;
}
