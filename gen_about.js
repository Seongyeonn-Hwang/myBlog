const fs   = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'blog', '999. withoutblog', 'About.md');
const raw    = fs.readFileSync(mdPath, 'utf8').trim();

// ![[파일명]] + 다음 줄 캡션 파싱
const items = [];
const lines = raw.split('\n');

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].trim().match(/^!\[\[(.+?)\]\]$/);
  if (m) {
    const file    = m[1].trim();
    const caption = lines[i + 1] ? lines[i + 1].trim() : '';
    items.push({ file: `aboutimage/${file}`, caption });
    i++;
  }
}

const out = `const ABOUT_ITEMS = ${JSON.stringify(items, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'about_content.js'), out, 'utf8');
console.log(`생성 완료: ${items.length}개 항목`);
