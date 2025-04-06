export function createHtmlTemplate(projectName, includeJS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="style.css">
  ${includeJS ? '<script src="script.js" defer></script>' : ''}
</head>
<body>
</body>
</html>`;
}