const fs = require('fs');

const files = [
  'frontend/src/app/(dashboard)/dashboard/student/page.tsx',
  'frontend/src/app/(dashboard)/dashboard/examiner/page.tsx',
  'frontend/src/app/(dashboard)/dashboard/admin/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\s*description="[^"]*"/g, '');
    fs.writeFileSync(file, content);
    console.log(`Fixed hardcoded descriptions in ${file}`);
  }
}
