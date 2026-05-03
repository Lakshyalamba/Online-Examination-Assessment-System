const fs = require('fs');
const file = 'frontend/src/app/global-error.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\s*description="[^"]*"/g, '');
  content = content.replace(/\s*items=\{[^}]*\}/g, '');
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}
