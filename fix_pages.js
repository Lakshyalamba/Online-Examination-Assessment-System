const fs = require('fs');

const dirs = fs.readdirSync('frontend/src/app/(dashboard)/dashboard', { withFileTypes: true });

for (const roleDir of dirs) {
  if (!roleDir.isDirectory() || roleDir.name === 'page.tsx') continue;
  
  const featureDirs = fs.readdirSync(`frontend/src/app/(dashboard)/dashboard/${roleDir.name}`, { withFileTypes: true });
  
  for (const featureDir of featureDirs) {
    if (!featureDir.isDirectory()) continue;
    
    const filePath = `frontend/src/app/(dashboard)/dashboard/${roleDir.name}/${featureDir.name}/page.tsx`;
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\s*description=\{page\.description\}/g, '');
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${filePath}`);
    }
  }
}
