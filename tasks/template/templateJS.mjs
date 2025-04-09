// JS template
export function createJsTemplate(projectName) {
  return `
document.addEventListener('DOMContentLoaded', () => {
  console.log('${projectName} loaded!');

});
`;
}