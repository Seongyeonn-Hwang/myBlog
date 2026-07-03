const fs   = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const base = path.join(__dirname, 'blog');

// Post date comes from git history (mtime gets reset to checkout time on every
// CI run, which would otherwise collapse all dates/order on the first CI push).
// Falls back to mtime for files not yet committed (e.g. update.bat runs this
// script before the commit).
function getPostDate(filePath) {
  try {
    const out = execFileSync(
      'git', ['log', '-1', '--format=%aI', '--', filePath],
      { cwd: __dirname, encoding: 'utf8' }
    ).trim();
    if (out) return new Date(out);
  } catch (e) {
    // not a git repo / git unavailable — fall back to mtime below
  }
  return fs.statSync(filePath).mtime;
}

function scanDir(dir, relativePath) {
  const items = [];
  const dateCache = new Map();
  const getDate = (name) => {
    if (!dateCache.has(name)) {
      dateCache.set(name, getPostDate(path.join(dir, name)));
    }
    return dateCache.get(name);
  };

  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.') && !/^9\d{2}[. ]/.test(e.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      if (!a.isDirectory() && !b.isDirectory()) {
        return getDate(b.name) - getDate(a.name);
      }
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
      const raw     = fs.readFileSync(entryPath, 'utf8');
      const content = raw.replace(/\(!보안\)([\s\S]*?)\(보안!\)/g, (_, t) => t.replace(/[^ \n]/g, '■'));
      const date    = getDate(entry.name);
      const dateStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
      items.push({
        type: 'file',
        name: entry.name.replace(/\.md$/, ''),
        path: relPath,
        date: dateStr,
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
