const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'js', 'pages');

fs.readdirSync(pagesDir).forEach(file => {
    if (!file.endsWith('.js')) return;
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Matches patterns like: const rowsHtml = someArray.map(x => `...`).join('');
    // We want to transform it to: const rowsHtml = someArray.length > 0 ? someArray.map(x => `...`).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found. Click Add to create one.</td></tr>';
    
    // Note: We need a careful regex or we can just replace `.join('');` if we find `.map(`
    // A simpler regex: find `const rowsHtml = ([a-zA-Z0-9_]+)\.map`
    
    const regex = /const rowsHtml = ([a-zA-Z0-9_]+)\.map\(([\s\S]*?)\.join\(''\);/g;
    
    content = content.replace(regex, (match, arrayName, innerContent) => {
        return `const rowsHtml = ${arrayName}.length > 0 ? ${arrayName}.map(${innerContent}.join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';`;
    });

    fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Added empty states.');
