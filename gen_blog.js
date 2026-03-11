const fs   = require('fs');
const path = require('path');

const base = path.join(__dirname, 'blog');

function scanDir(dir, relativePath) {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.'))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name, 'ko');
    });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const relPath   = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      items.push({
        type: 'folder',
        name: entry.name,
        path: relPath,
        children: scanDir(entryPath, relPath)
      });
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(entryPath, 'utf8');
      items.push({
        type: 'file',
        name: entry.name.replace(/\.md$/, ''),
        path: relPath,
        content
      });
    }
  }

  return items;
}

const tree = scanDir(base, '');
const out  = `const BLOG_FILES = ${JSON.stringify(tree, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'blog_files.js'), out, 'utf8');
console.log(`생성 완료: blog_files.js`);
