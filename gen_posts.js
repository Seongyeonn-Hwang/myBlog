const fs   = require('fs');
const path = require('path');

const base  = path.join(__dirname, '01. Daily notes');
const posts = [];

function parseDate(filename) {
  const name = filename.replace('.md', '');
  try {
    const m = name.match(/(\d+)年\s*(\d+)月\s*(\d+)日/);
    if (!m) return { iso: '0000-00-00', display: name };
    const y = m[1].length === 2 ? '20' + m[1] : m[1];
    const mo = m[2].padStart(2, '0');
    const d  = m[3].padStart(2, '0');
    return { iso: `${y}-${mo}-${d}`, display: `${y}년 ${parseInt(m[2])}월 ${parseInt(m[3])}일` };
  } catch(e) { return { iso: '0000-00-00', display: name }; }
}

// 루트 레벨
fs.readdirSync(base).filter(f => f.endsWith('.md')).forEach(f => {
  const { iso, display } = parseDate(f);
  const content = fs.readFileSync(path.join(base, f), 'utf8');
  posts.push({ date: iso, display, week: 'latest', path: '01. Daily notes/' + f, content });
});

// W1~W10
for (let i = 1; i <= 10; i++) {
  const folder = path.join(base, 'W' + i);
  if (!fs.existsSync(folder)) continue;
  fs.readdirSync(folder).filter(f => f.endsWith('.md')).forEach(f => {
    const { iso, display } = parseDate(f);
    const content = fs.readFileSync(path.join(folder, f), 'utf8');
    posts.push({ date: iso, display, week: 'W' + i, path: '01. Daily notes/W' + i + '/' + f, content });
  });
}

posts.sort((a, b) => b.date.localeCompare(a.date));

const out = `const POSTS = ${JSON.stringify(posts, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'posts.js'), out, 'utf8');
console.log(`생성 완료: ${posts.length}개 포스트`);
