const fs = require('fs');
const files = [
  'frontend/src/app/(dashboard)/error.tsx',
  'frontend/src/app/not-found.tsx',
  'frontend/src/app/error.tsx',
  'frontend/src/app/(public)/error.tsx',
  'frontend/src/app/(public)/not-found.tsx',
  'frontend/src/app/(dashboard)/dashboard/error.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\s*description="[^"]*"/g, '');
    content = content.replace(/\s*items=\{[^}]*\}/g, '');
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}
