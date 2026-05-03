const fs = require('fs');
const file = 'frontend/src/app/(public)/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/ease:\s*"easeOut"/g, 'ease: "easeOut" as any');
fs.writeFileSync(file, content);
console.log('Fixed');
