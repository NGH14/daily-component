export default function createJSTemplate(projectName) {
  return `
document.addEventListener('DOMContentLoaded', () => {
  console.log('${projectName} loaded!');
});
`;
}
