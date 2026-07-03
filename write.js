/* write.js — 비공개 웹 에디터 (GitHub Git Trees API 원자적 단일 커밋)
   이 파일은 어떤 공개 페이지에서도 로드되지 않으며 write.html 전용이다. */

const OWNER  = 'Seongyeonn-Hwang';
const REPO   = 'myBlog';
const BRANCH = 'master';
const DIARY_DIR = 'blog/01. Diary';
const IMAGE_DIR = 'blog/900. image';
const TOKEN_KEY = 'myblog_pat';
const API = 'https://api.github.com';

/* ===== 토큰 (localStorage 래퍼) ===== */
function getToken()   { return localStorage.getItem(TOKEN_KEY) || ''; }
function setToken(t)  { localStorage.setItem(TOKEN_KEY, t.trim()); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

/* ===== 인코딩 헬퍼 ===== */
// 경로 세그먼트별 URL 인코딩 (공백/한글/마침표 포함 경로용). '/'는 보존.
function encodePath(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}
// UTF-8 문자열 → base64 (한글 안전)
function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin);
}
// base64 → UTF-8 문자열 (한글 안전)
function b64ToUtf8(b64) {
  const bin = atob((b64 || '').replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

/* ===== GitHub API fetch 래퍼 ===== */
async function ghFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.headers || {}),
    },
  });
  return res;
}

async function ghJson(path, opts) {
  const res = await ghFetch(path, opts);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `GitHub API ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

/* ===== 조회 ===== */
// 01. Diary 디렉토리의 .md 글 목록
async function listPosts() {
  const list = await ghJson(
    `/repos/${OWNER}/${REPO}/contents/${encodePath(DIARY_DIR)}?ref=${BRANCH}`
  );
  return list
    .filter(e => e.type === 'file' && e.name.endsWith('.md'))
    .map(e => ({ name: e.name.replace(/\.md$/, ''), path: e.path, sha: e.sha }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

// 파일 내용(base64 디코딩) + sha
async function loadPost(path) {
  const data = await ghJson(
    `/repos/${OWNER}/${REPO}/contents/${encodePath(path)}?ref=${BRANCH}`
  );
  return { content: b64ToUtf8(data.content), sha: data.sha };
}

/* ===== 원자적 단일 커밋 (Git Trees API) ===== */
// {postPath, postContent, imagePath?, imageBase64?}
// non-fast-forward(그 사이 다른 커밋 push) 시 처음부터 재시도.
async function commitPostWithImage({ postPath, postContent, imagePath, imageBase64 }, attempt = 0) {
  // 1) 저장 직전 HEAD ref + base_tree 를 항상 새로 조회 (캐시 금지)
  const ref = await ghJson(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
  const headSha = ref.object.sha;
  const headCommit = await ghJson(`/repos/${OWNER}/${REPO}/git/commits/${headSha}`);
  const baseTree = headCommit.tree.sha;

  // 2) 이미지 blob (있으면)
  const tree = [];
  if (imagePath && imageBase64) {
    const imgBlob = await ghJson(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: imageBase64, encoding: 'base64' }),
    });
    tree.push({ path: imagePath, mode: '100644', type: 'blob', sha: imgBlob.sha });
  }

  // 3) 마크다운 blob (base64로 전송 — 한글 안전)
  const mdBlob = await ghJson(`/repos/${OWNER}/${REPO}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: utf8ToB64(postContent), encoding: 'base64' }),
  });
  tree.push({ path: postPath, mode: '100644', type: 'blob', sha: mdBlob.sha });

  // 4) base_tree 위에 변경 파일만 담은 새 tree (각 엔트리 sha = 새 blob sha)
  const newTree = await ghJson(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });

  // 5) 새 commit (parent = 위 HEAD sha)
  const title = postPath.replace(/^.*\//, '').replace(/\.md$/, '');
  const newCommit = await ghJson(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `web: ${title}`,
      tree: newTree.sha,
      parents: [headSha],
    }),
  });

  // 6) 브랜치 ref 업데이트 (fast-forward만 허용)
  const patch = await ghFetch(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });

  if (patch.status === 422 && attempt < 5) {
    // non-fast-forward: 그 사이 다른 커밋이 push됨 → 1)부터 재시도
    return commitPostWithImage(
      { postPath, postContent, imagePath, imageBase64 },
      attempt + 1
    );
  }
  if (!patch.ok) {
    const body = await patch.json().catch(() => ({}));
    throw new Error(body.message || `ref update 실패 (${patch.status})`);
  }
  return { commitSha: newCommit.sha };
}

/* ===== 발행 확인 폴링 (Contents API로 blog_files.js sha 변화 감지) =====
   Pages/raw URL의 CDN 캐시에 의존하지 않도록 반드시 Contents API 사용. */
async function getBlogFilesSha() {
  const data = await ghJson(`/repos/${OWNER}/${REPO}/contents/blog_files.js?ref=${BRANCH}`);
  return data.sha;
}

// baselineSha 대비 변화가 감지되면 resolve(true). timeout이면 resolve(false).
async function pollPublished(baselineSha, { timeoutMs = 180000, intervalMs = 6000, onTick } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise(r => setTimeout(r, intervalMs));
    let sha;
    try { sha = await getBlogFilesSha(); } catch { continue; }
    if (onTick) onTick(Math.round((Date.now() - start) / 1000));
    if (sha && sha !== baselineSha) return true;
  }
  return false;
}

/* ============================================================
   UI 배선
   ============================================================ */
const $ = id => document.getElementById(id);

const state = {
  editingPath: null,   // 수정 중인 기존 글 경로 (신규면 null)
  pendingImage: null,  // { filename, base64 }
};

function show(el, on) { el.style.display = on ? '' : 'none'; }

function renderAuthState() {
  const authed = !!getToken();
  show($('token-view'), !authed);
  show($('main-view'), authed);
  if (authed) refreshPosts();
}

async function refreshPosts() {
  const box = $('post-list');
  box.innerHTML = '<div class="muted">불러오는 중…</div>';
  try {
    const posts = await listPosts();
    if (!posts.length) { box.innerHTML = '<div class="muted">글이 없습니다.</div>'; return; }
    box.innerHTML = '';
    posts.forEach(p => {
      const b = document.createElement('button');
      b.className = 'post-item';
      b.textContent = p.name;
      b.addEventListener('click', () => openEditor(p.path));
      box.appendChild(b);
    });
  } catch (e) {
    box.innerHTML = '';
    const err = document.createElement('div');
    err.className = 'err';
    err.textContent = '목록 오류: ' + e.message;
    box.appendChild(err);
    if (e.status === 401) { clearToken(); renderAuthState(); }
  }
}

function resetEditor() {
  state.editingPath = null;
  state.pendingImage = null;
  $('post-title').value = '';
  $('post-body').value = '';
  $('image-input').value = '';
  $('image-info').textContent = '';
  $('save-status').textContent = '';
  $('save-status').className = 'save-status';
}

function openNew() {
  resetEditor();
  $('editor-title').textContent = '새 글쓰기';
  $('post-title').disabled = false;
  show($('editor'), true);
  $('post-title').focus();
}

async function openEditor(path) {
  resetEditor();
  $('editor-title').textContent = '글 수정';
  show($('editor'), true);
  $('save-status').textContent = '불러오는 중…';
  try {
    const { content } = await loadPost(path);
    state.editingPath = path;
    $('post-title').value = path.replace(/^.*\//, '').replace(/\.md$/, '');
    $('post-title').disabled = true; // 파일명=제목이라 수정 시 제목 변경 금지 (rename은 스코프 밖)
    $('post-body').value = content;
    $('save-status').textContent = '';
  } catch (e) {
    $('save-status').textContent = '불러오기 실패: ' + e.message;
    $('save-status').className = 'save-status err';
  }
}

function insertAtCursor(textarea, text) {
  const s = textarea.selectionStart, e = textarea.selectionEnd;
  textarea.value = textarea.value.slice(0, s) + text + textarea.value.slice(e);
  textarea.selectionStart = textarea.selectionEnd = s + text.length;
  textarea.focus();
}

function handleImagePick(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const b64 = String(reader.result).split(',')[1]; // data URL → base64 페이로드
    state.pendingImage = { filename: file.name, base64: b64 };
    $('image-info').textContent = `첨부됨: ${file.name} — "이미지 삽입"으로 본문에 넣으세요`;
  };
  reader.readAsDataURL(file);
}

function insertImageEmbed() {
  if (!state.pendingImage) { $('image-info').textContent = '먼저 이미지를 선택하세요.'; return; }
  // blog.html 렌더러가 지원하는 Obsidian 임베드 문법 (표준 ![]() 아님)
  insertAtCursor($('post-body'), `\n![[900. image/${state.pendingImage.filename}]]\n`);
}

async function onSave() {
  const status = $('save-status');
  const title = $('post-title').value.trim();
  const body  = $('post-body').value;
  if (!title) { status.textContent = '제목을 입력하세요.'; status.className = 'save-status err'; return; }

  // 파일명 = 제목 그대로 (ASCII slugify 금지) — gen_blog.js가 파일명을 제목으로 사용
  const postPath = state.editingPath || `${DIARY_DIR}/${title}.md`;
  const payload = { postPath, postContent: body };
  if (state.pendingImage) {
    payload.imagePath   = `${IMAGE_DIR}/${state.pendingImage.filename}`;
    payload.imageBase64 = state.pendingImage.base64;
  }

  $('save-btn').disabled = true;
  status.className = 'save-status';
  status.textContent = '저장 중…';
  try {
    const baseline = await getBlogFilesSha().catch(() => null);
    await commitPostWithImage(payload);
    status.textContent = '저장됨 — 발행 확인 중… (수 분 소요)';
    const published = await pollPublished(baseline, {
      onTick: s => { status.textContent = `저장됨 — 발행 확인 중… (${s}s)`; },
    });
    if (published) {
      status.className = 'save-status ok';
      status.textContent = '발행 완료 ✓ blog.html에서 확인하세요.';
    } else {
      status.className = 'save-status warn';
      status.innerHTML = '저장은 됐지만 발행이 아직 확인되지 않았습니다. ' +
        `<a href="https://github.com/${OWNER}/${REPO}/actions" target="_blank" rel="noopener">Actions 탭</a>에서 상태를 확인하세요.`;
    }
    refreshPosts();
  } catch (e) {
    status.className = 'save-status err';
    status.textContent = '저장 실패: ' + e.message;
    if (e.status === 401) { clearToken(); renderAuthState(); }
  } finally {
    $('save-btn').disabled = false;
  }
}

/* ===== 이벤트 등록 ===== */
document.addEventListener('DOMContentLoaded', () => {
  $('token-save').addEventListener('click', () => {
    const t = $('token-input').value.trim();
    if (!t) return;
    setToken(t);
    $('token-input').value = '';
    renderAuthState();
  });
  $('logout-btn').addEventListener('click', () => {
    clearToken();
    renderAuthState();
  });
  $('new-btn').addEventListener('click', openNew);
  $('image-input').addEventListener('change', e => handleImagePick(e.target.files[0]));
  $('insert-image-btn').addEventListener('click', insertImageEmbed);
  $('save-btn').addEventListener('click', onSave);
  $('cancel-btn').addEventListener('click', () => show($('editor'), false));

  renderAuthState();
});
