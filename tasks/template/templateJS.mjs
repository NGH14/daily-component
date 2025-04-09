// JS template
function createJsTemplate(projectName) {
  return `
document.addEventListener('DOMContentLoaded', () => {
  console.log('${projectName} loaded!');

});
`;
}