const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const watchDir = path.join(__dirname, 'blog');
let debounce   = null;

function rebuild() {
  try {
    execSync('node gen_blog.js', { stdio: 'inherit' });
  } catch (e) {
    console.error('gen_blog.js 실행 실패:', e.message);
  }
}

console.log(`blog 폴더 감시 중... (종료: Ctrl+C)`);

fs.watch(watchDir, { recursive: true }, (event, filename) => {
  if (!filename || !filename.endsWith('.md')) return;

  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log(`변경 감지: ${filename}`);
    rebuild();
  }, 300);
});
