const grid     = document.getElementById('post-grid');
const countEl  = document.getElementById('post-count');
const backdrop = document.getElementById('modal-backdrop');
const modalDate = document.getElementById('modal-date');
const modalBody = document.getElementById('modal-body');

// ===== 프론트매터 제거 =====
function stripFrontmatter(md) {
  return md.replace(/^---[\s\S]*?---\n?/, '');
}

// ===== 마크다운 → HTML (라이브러리 없이 간단 변환) =====
function mdToHtml(md) {
  // 표를 먼저 추출해 플레이스홀더로 치환 (이스케이프 방지)
  const tables = [];
  md = md.replace(/^(\|.+\|[ \t]*\n)([ \t]*\|[-| :]+\|[ \t]*\n)((?:[ \t]*\|.+\|[ \t]*\n?)*)/gm,
    (_, header, _sep, body) => {
      const toRow = (line, tag) =>
        '<tr>' + line.trim().replace(/^\||\|$/g, '').split('|')
          .map(c => `<${tag} class="md-td">${c.trim()}</${tag}>`).join('') + '</tr>';
      const html = `<table class="md-table"><thead>${toRow(header, 'th')}</thead><tbody>${
        body.trim().split('\n').filter(Boolean).map(l => toRow(l, 'td')).join('')
      }</tbody></table>`;
      tables.push(html);
      return `\x00TABLE${tables.length - 1}\x00`;
    });

  let result = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // 헤딩
    .replace(/^#{6}\s(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s(.+)$/gm, '<h1>$1</h1>')
    // 볼드 / 이탤릭
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 탭 들여쓰기 → 리스트 아이템
    .replace(/^\t+\d+\.\s(.+)$/gm, '<li>$1</li>')
    .replace(/^\t+[-*]\s(.+)$/gm, '<li>$1</li>')
    // 일반 리스트
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    .replace(/^[-*]\s(.+)$/gm, '<li>$1</li>')
    // 가로선
    .replace(/^---+$/gm, '<hr/>')
    // 빈 줄 → 단락 구분
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');

  // 플레이스홀더 → 표 HTML 복원
  tables.forEach((html, i) => { result = result.replace(`\x00TABLE${i}\x00`, html); });
  return result;
}

// ===== 렌더링 =====
function renderPosts(filter) {
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? POSTS
    : POSTS.filter(p => p.date.startsWith(filter));

  countEl.textContent = `${filtered.length} posts`;

  filtered.forEach(post => {
    const excerpt = stripFrontmatter(post.content).slice(0, 80).replace(/#+\s/g, '').replace(/\n/g, ' ').trim();

    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <div class="post-thumb"><div class="post-thumb-placeholder"></div></div>
      <div class="post-meta">
        <span class="post-week">${post.week === 'latest' ? 'RECENT' : post.week}</span>
        <span class="post-date">${post.display}</span>
      </div>
      <p class="post-title">${post.display}</p>
      <p class="post-excerpt">${excerpt}…</p>
    `;
    card.addEventListener('click', () => openPost(post));
    grid.appendChild(card);
  });
}

// ===== 모달 열기 =====
function openPost(post) {
  modalDate.textContent = post.display;
  modalBody.innerHTML   = '<p>' + mdToHtml(stripFrontmatter(post.content)) + '</p>';
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== 필터 =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPosts(btn.dataset.filter);
  });
});

renderPosts('all');
