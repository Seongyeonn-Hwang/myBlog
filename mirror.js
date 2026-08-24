#!/usr/bin/env node
'use strict';

/*
 * mirror.js — vault(private) -> 공개 repo 미러링 준비 스크립트
 *
 * 책임 (ralplan S2-2)
 *   1. vault를 재귀 스캔해 .md만 수집한다. `.obsidian/`·`91.Templates/**`는 제외.
 *   2. frontmatter의 `publish` 플래그가 boolean true일 때만 발행 대상으로 삼는다.
 *      "true"·yes·1·누락은 전부 비발행 — 실수의 방향을 항상 "안 올라감"으로 고정한다.
 *   3. `publish` 오타(콜론 앞 공백, 값이 boolean이 아님)는 경고로 알린다. 조용한 비선택 금지.
 *   4. 데일리 노트는 `publish: true`가 있어도 거부하고 프로세스를 실패시킨다(PM-1).
 *   5. 날짜는 frontmatter `date:` 우선, 없으면 git 최초 추가 시각.
 *   6. 내부·스테이징 frontmatter는 ISO 8601, 인덱스 출력은 `YYYY.MM.DD`.
 *   7. `_staging/`에 vault와 동일한 상대경로로 .md만 기록한다.
 *   8. `blog_index.json`을 만든다 — 본문(content) 없음.
 *   9. 배열 순서는 옛 gen_blog.js:36-43의 정렬을 그대로 재현한다.
 *
 * 의존성 없음 (Node 20 표준 라이브러리만).
 *
 * 사용법
 *   node mirror.js                 vault 루트에서 _staging/ 과 blog_index.json 생성
 *   node mirror.js --dry-run       파일을 쓰지 않고 발행될 상대경로만 stdout에 출력
 *   node mirror.js --vault <dir>   vault 루트 지정 (기본: 이 스크립트가 있는 폴더)
 *   node mirror.js --out <dir>     산출물 루트 지정 (기본: vault 루트)
 *
 * 종료 코드: 0 성공 / 1 실패(데일리 노트 거부, 날짜 확정 불가 등). 조용한 성공은 없다.
 */

const fs   = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// ------------------------------------------------------------------ 상수

const STAGING_NAME = '_staging';
const INDEX_NAME   = 'blog_index.json';

// `02. Areas/Daily Notes/**` — 폴더 위치가 바뀌어도 걸리도록 세그먼트 단위로 본다.
const DAILY_PATH_RE  = /(^|\/)daily notes\//i;
// `91.Templates` (`91. Templates`, `91Templates` 표기 흔들림 허용)
const TEMPLATES_RE   = /^91\s*\.?\s*templates$/i;
// `![[...]]` 임베드 중 .md가 아닌 첨부 — 미러링되지 않으므로 발행하면 깨진다.
const EMBED_RE       = /!\[\[([^\]|#\n]+?)(?:[|#][^\]\n]*)?\]\]/g;
const ATTACHMENT_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|ico|mp3|wav|m4a|flac|ogg|mp4|mov|webm|pdf|xlsx?|docx?|pptx?|zip)$/i;

// ------------------------------------------------------------------ 로그

const warnings = [];
function warn(rel, msg) {
  warnings.push({ rel, msg });
  process.stderr.write('[warn] ' + rel + ': ' + msg + '\n');
}
function fail(msg) {
  process.stderr.write('[error] ' + msg + '\n');
}

// ------------------------------------------------------------ frontmatter

function stripBom(s) {
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
}

/**
 * 파일을 frontmatter 블록과 나머지로 나눈다.
 * frontmatter는 파일 첫 줄이 `---`이고 이후 `---`(또는 `...`)로 닫힐 때만 인정한다.
 */
function splitFrontmatter(raw) {
  const text  = stripBom(raw);
  const eol   = /\r\n/.test(text) ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const empty = { eol: eol, lines: lines, fmStart: -1, fmEnd: -1, fmLines: [] };

  if (lines.length === 0 || lines[0].trim() !== '---') return empty;
  for (let i = 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '---' || t === '...') {
      return { eol: eol, lines: lines, fmStart: 1, fmEnd: i, fmLines: lines.slice(1, i) };
    }
  }
  return empty;
}

/**
 * frontmatter 라인을 `key: value` 레코드로 만든다.
 * 리스트 항목(`- x`)·주석·빈 줄은 건너뛴다. 중첩 키는 topLevel=false로 표시만 한다.
 */
function frontmatterEntries(fmLines) {
  const out = [];
  for (const line of fmLines) {
    if (!line.trim() || /^\s*#/.test(line) || /^\s*-\s/.test(line)) continue;
    const m = /^(\s*)([^:]+?)\s*:\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    out.push({
      raw: line,
      indent: m[1],
      keyRaw: m[2],
      key: m[2].trim().toLowerCase(),
      value: m[3],
      topLevel: m[1] === ''
    });
  }
  return out;
}

/** YAML 스칼라를 최소한으로 해석한다. 따옴표가 있으면 언제나 문자열이다. */
function parseScalar(v) {
  if (v === '') return { kind: 'empty', value: null };
  const q = /^(["'])([\s\S]*)\1$/.exec(v);
  if (q) return { kind: 'string', value: q[2] };
  if (/^(true|True|TRUE)$/.test(v))    return { kind: 'bool', value: true };
  if (/^(false|False|FALSE)$/.test(v)) return { kind: 'bool', value: false };
  return { kind: 'plain', value: v };
}

/**
 * publish 플래그 판정 + 오타 경고.
 *
 * 선택 조건 — 최상위 키가 정확히 `publish:`(들여쓰기 없음, 콜론 앞 공백 없음)이고
 *             값이 따옴표 없는 boolean true일 때만.
 * 경고 조건 — (A) 정규화 키(trim+소문자)가 정확히 `publish`인데 선택되지 않음
 *             (B) 원시 라인이 /^\s*publish\s+:/ (콜론 앞 공백)에 매칭
 * `publisher`·`published_year`는 두 규칙 모두 매칭되지 않는다
 * (정확 일치 요구 + 콜론 직전 공백 요구). 오탐이 상시화되면 경고 자체가 무의미해진다.
 */
function evaluatePublish(entries, fmLines) {
  let selected = false;
  const msgs = [];
  const seen = new Set();
  const push = function (line, msg) {
    if (!seen.has(line)) { seen.add(line); msgs.push(msg); }
  };

  for (const e of entries) {
    if (e.key !== 'publish') continue;
    if (e.topLevel && /^publish:/.test(e.raw)) {
      const s = parseScalar(e.value);
      if (s.kind === 'bool' && s.value === true) { selected = true; continue; }
      push(e.raw, "'publish' 값이 boolean true가 아니라 발행되지 않습니다 -> " + JSON.stringify(e.raw));
      continue;
    }
    // 들여쓰기됐거나 콜론 앞에 공백이 있는 경우 — 최상위 publish 플래그로 취급하지 않는다.
    push(e.raw, "'publish' 키 표기가 잘못되어 발행되지 않습니다(들여쓰기/콜론 앞 공백) -> " + JSON.stringify(e.raw));
  }

  for (const line of fmLines) {
    if (/^\s*publish\s+:/.test(line)) {
      push(line, '콜론 앞 공백 스타일은 발행 플래그로 인식되지 않습니다 -> ' + JSON.stringify(line));
    }
  }

  return { selected: selected, warnings: msgs };
}

// ------------------------------------------------------------------ 날짜

/**
 * 날짜 문자열 -> {y, m, d}. 해석 불가면 null.
 * 2자리 연도는 20xx로 해석한다(`26年 01月 10日` -> 2026-01-10).
 * `new Date(str)`는 쓰지 않는다 — 쓰레기 값을 조용히 받아들이기 때문이다.
 */
function parseDateValue(input) {
  if (input == null) return null;
  const v = String(input).trim().replace(/^(["'])([\s\S]*)\1$/, '$2').trim();
  if (!v) return null;

  function century(y) { return y.length === 2 ? 2000 + Number(y) : Number(y); }
  function mk(y, mo, d) {
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const probe = new Date(Date.UTC(y, mo - 1, d));
    if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
    return { y: y, m: mo, d: d };
  }

  let m;
  if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ][\d:.+\-Z]*)?$/.exec(v))) {
    return mk(Number(m[1]), Number(m[2]), Number(m[3]));
  }
  if ((m = /^(\d{2}|\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日$/.exec(v))) {
    return mk(century(m[1]), Number(m[2]), Number(m[3]));
  }
  if ((m = /^(\d{2}|\d{4})[./](\d{1,2})[./](\d{1,2})$/.exec(v))) {
    return mk(century(m[1]), Number(m[2]), Number(m[3]));
  }
  return null;
}

function pad(n) { return String(n).padStart(2, '0'); }
function toIso(p)     { return p.y + '-' + pad(p.m) + '-' + pad(p.d); }   // frontmatter / 내부
function toDisplay(p) { return p.y + '.' + pad(p.m) + '.' + pad(p.d); }   // 인덱스 출력
function toSortKey(p) { return p.y * 10000 + p.m * 100 + p.d; }

/** `git log --diff-filter=A --format=%aI -- <path>`의 마지막 줄 = 최초 추가 시각. */
function gitFirstAdded(vaultRoot, rel) {
  try {
    const out = execFileSync(
      'git', ['log', '--diff-filter=A', '--format=%aI', '--', rel],
      { cwd: vaultRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    const lines = out.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    return lines.length ? lines[lines.length - 1] : null;
  } catch (e) {
    return null;
  }
}

// ------------------------------------------------------------------ 스캔

function isExcludedDirDefault(name) {
  return name.charAt(0) === '.'        // .obsidian, .git, .github
      || name === STAGING_NAME
      || name === 'node_modules'
      || TEMPLATES_RE.test(name);
}

/**
 * 중첩된 git 체크아웃인가. 워크플로가 공개 repo를 vault 워킹트리 안(`public/`)에 클론하므로,
 * 실행 순서가 어긋나면 이미 미러링된 `.md`(publish: true가 그대로 들어 있다)를 다시 긁어
 * `public/blog/...` 경로로 재발행하게 된다. 이름이 아니라 구조로 막는다.
 */
function isNestedRepo(dirAbs) {
  return fs.existsSync(path.join(dirAbs, '.git'));
}

/** vault를 재귀 스캔해 .md 상대경로를 readdir 순서대로 모은다. */
function collectMarkdown(root, isExcludedDir) {
  const excluded = isExcludedDir || isExcludedDirDefault;
  const out = [];
  (function walk(dirAbs, relDir) {
    for (const e of fs.readdirSync(dirAbs, { withFileTypes: true })) {
      const rel = relDir ? relDir + '/' + e.name : e.name;
      if (e.isDirectory()) {
        if (excluded(e.name, rel)) continue;
        if (isNestedRepo(path.join(dirAbs, e.name))) continue;
        walk(path.join(dirAbs, e.name), rel);
      } else if (e.isFile() && e.name.endsWith('.md')) {
        out.push(rel);
      }
    }
  })(root, '');
  return out;
}

// ------------------------------------------------------------------ 정렬

/**
 * 옛 gen_blog.js:36-43의 비교자를 그대로 재현한다.
 *   폴더 우선 -> 파일끼리는 date 내림차순 -> 폴더끼리는 localeCompare(name, 'ko')
 *
 * blog.html:480 buildTree는 items.forEach로 배열 순서를 그대로 렌더링하며 클라이언트
 * 정렬 로직이 전무하다. 즉 이 비교자가 곧 사이트의 목록 순서다 — 바꾸면 조용히 뒤집힌다.
 */
function compareEntries(a, b) {
  const ad = a.type === 'folder';
  const bd = b.type === 'folder';
  if (ad && !bd) return -1;
  if (!ad && bd) return 1;
  if (!ad && !bd) return b._sort - a._sort;
  return a.name.localeCompare(b.name, 'ko');
}

/**
 * 인덱스 트리를 만든다. 노드는 {type, name, path, date, children} — content 키는 없다.
 *
 * opts.includeFile(rel, name, abs) -> {display, sort} | null   null이면 그 파일은 제외
 * opts.isExcludedDir(name, rel)    -> boolean
 * opts.prune                       -> 발행 대상이 없는 폴더 노드를 버릴지(기본 true)
 */
function buildIndexTree(root, opts) {
  const isExcludedDir = opts.isExcludedDir || isExcludedDirDefault;
  const includeFile   = opts.includeFile;
  const prune         = opts.prune !== false;

  function walk(dirAbs, relDir) {
    const items = [];
    for (const e of fs.readdirSync(dirAbs, { withFileTypes: true })) {
      const rel = relDir ? relDir + '/' + e.name : e.name;
      if (e.isDirectory()) {
        if (isExcludedDir(e.name, rel)) continue;
        if (isNestedRepo(path.join(dirAbs, e.name))) continue;
        const children = walk(path.join(dirAbs, e.name), rel);
        if (prune && children.length === 0) continue;
        items.push({ type: 'folder', name: e.name, path: rel, children: children });
      } else if (e.isFile() && e.name.endsWith('.md')) {
        const d = includeFile(rel, e.name, path.join(dirAbs, e.name));
        if (!d) continue;
        items.push({
          type: 'file',
          name: e.name.replace(/\.md$/, ''),
          path: rel,
          date: d.display,
          _sort: d.sort
        });
      }
    }
    // Array.prototype.sort는 안정 정렬이므로 date가 같으면 readdir 순서가 유지된다.
    items.sort(compareEntries);
    return items;
  }

  return walk(root, '');
}

// -------------------------------------------------------- 스테이징 본문 가공

/**
 * 스테이징 사본의 frontmatter `date:`를 ISO로 정규화한다(없으면 신설).
 * vault 원본은 절대 건드리지 않는다 — 이 함수는 문자열만 다룬다.
 */
function withIsoDate(raw, iso) {
  const fm = splitFrontmatter(raw);
  if (fm.fmStart === -1) {
    return ['---', 'date: ' + iso, '---', ''].concat(fm.lines).join(fm.eol);
  }
  const lines = fm.lines.slice();
  for (let i = fm.fmStart; i < fm.fmEnd; i++) {
    const m = /^(\s*)([^:]+?)\s*:\s*(.*?)\s*$/.exec(lines[i]);
    if (m && m[1] === '' && m[2].trim().toLowerCase() === 'date') {
      lines[i] = 'date: ' + iso;
      return lines.join(fm.eol);
    }
  }
  lines.splice(fm.fmEnd, 0, 'date: ' + iso);
  return lines.join(fm.eol);
}

/** 첨부(`![[a.png]]`) 임베드를 찾는다 — 첨부는 미러링되지 않아 발행하면 깨진다. */
function findAttachmentEmbeds(raw) {
  const found = [];
  let m;
  EMBED_RE.lastIndex = 0;
  while ((m = EMBED_RE.exec(raw)) !== null) {
    const target = m[1].trim();
    if (ATTACHMENT_EXT.test(target)) found.push(target);
  }
  return Array.from(new Set(found));
}

// ------------------------------------------------------------------ main

function parseArgs(argv) {
  const opts = { dryRun: false, vault: __dirname, out: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--vault') opts.vault = path.resolve(argv[++i]);
    else if (a === '--out')   opts.out   = path.resolve(argv[++i]);
    else if (a === '--help' || a === '-h') opts.help = true;
    else throw new Error('알 수 없는 인자: ' + a);
  }
  if (!opts.out) opts.out = opts.vault;
  return opts;
}

function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (e) {
    fail(e.message);
    return 1;
  }
  if (opts.help) {
    process.stdout.write('사용법: node mirror.js [--dry-run] [--vault <dir>] [--out <dir>]\n');
    return 0;
  }

  const vault = opts.vault;
  if (!fs.existsSync(vault)) { fail('vault 경로가 없습니다: ' + vault); return 1; }

  const all = collectMarkdown(vault);
  const selected = [];   // { rel, raw, entries }
  const rejected = [];   // 데일리 노트 하드 거부

  for (const rel of all) {
    const abs = path.join(vault, rel);
    const raw = fs.readFileSync(abs, 'utf8');
    const fm  = splitFrontmatter(raw);
    const entries = frontmatterEntries(fm.fmLines);
    const verdict = evaluatePublish(entries, fm.fmLines);

    for (const w of verdict.warnings) warn(rel, w);
    if (!verdict.selected) continue;

    // PM-1 하드 거부 — 옵트인 위에 얹는 거부 목록.
    // 최고위험 범주(데일리 노트)를 "실수로도 발행 불가능"하게 만든다.
    const typeEntry = entries.find(function (e) { return e.topLevel && e.key === 'type'; });
    const typeVal   = typeEntry ? parseScalar(typeEntry.value).value : null;
    const isDaily   = (typeof typeVal === 'string' && typeVal.trim().toLowerCase() === 'daily')
                   || DAILY_PATH_RE.test(rel);
    if (isDaily) { rejected.push(rel); continue; }

    selected.push({ rel: rel, raw: raw, entries: entries });
  }

  if (rejected.length) {
    fail('데일리 노트는 publish: true가 있어도 발행할 수 없습니다 (PM-1 하드 거부).');
    for (const rel of rejected) fail('  거부: ' + rel);
    fail('해당 파일에서 publish 플래그를 제거한 뒤 다시 push하세요.');
    return 1;
  }

  // --dry-run: 선택된 상대경로만 stdout에 출력한다(AC3이 이 출력에 의존).
  // 날짜 확정과 스테이징 기록은 건너뛴다 — "어떤 파일이 발행되는가"에만 답한다.
  // 경고·거부는 그대로 동작한다.
  if (opts.dryRun) {
    for (const s of selected) process.stdout.write(s.rel + '\n');
    return 0;
  }

  // ---- 날짜 확정. 하나라도 못 구하면 실패한다 (조용한 성공 금지, OB-2/R9).
  const dateFailures = [];
  for (const s of selected) {
    const dateEntry = s.entries.find(function (e) { return e.topLevel && e.key === 'date'; });
    if (dateEntry && dateEntry.value !== '') {
      const parsed = parseDateValue(dateEntry.value);
      if (!parsed) {
        dateFailures.push(s.rel + ': frontmatter date를 해석할 수 없습니다 -> ' + JSON.stringify(dateEntry.value));
        continue;
      }
      s.date = parsed;
      s.dateSource = 'frontmatter';
      continue;
    }
    const iso = gitFirstAdded(vault, s.rel);
    if (!iso) {
      dateFailures.push(s.rel + ': frontmatter date가 없고 git 최초 추가 시각도 찾을 수 없습니다 ' +
                        '(checkout이 fetch-depth: 0 인지, 파일이 커밋됐는지 확인하세요)');
      continue;
    }
    const parsed = parseDateValue(iso);
    if (!parsed) {
      dateFailures.push(s.rel + ': git이 돌려준 날짜를 해석할 수 없습니다 -> ' + JSON.stringify(iso));
      continue;
    }
    s.date = parsed;
    s.dateSource = 'git';
  }

  if (dateFailures.length) {
    fail('날짜를 확정하지 못한 파일이 있어 미러링을 중단합니다.');
    for (const m of dateFailures) fail('  ' + m);
    return 1;
  }

  // ---- 첨부 임베드 경고 (R6/OB-3) — 첨부는 미러링하지 않으므로 사이트에서 깨진다.
  for (const s of selected) {
    const embeds = findAttachmentEmbeds(s.raw);
    if (embeds.length) {
      warn(s.rel, '첨부 임베드 ' + embeds.length + '건은 미러링되지 않아 사이트에서 깨집니다 -> ' +
                  embeds.slice(0, 5).join(', '));
    }
  }

  // ---- _staging/ 전량 재생성. .md 외의 파일은 어떤 경로로도 들어가지 않는다.
  const staging = path.join(opts.out, STAGING_NAME);
  fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });

  for (const s of selected) {
    const dest = path.join(staging, s.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, withIsoDate(s.raw, toIso(s.date)), 'utf8');
  }

  // ---- blog_index.json (본문 없음)
  const byRel = new Map(selected.map(function (s) { return [s.rel, s.date]; }));
  const tree = buildIndexTree(vault, {
    includeFile: function (rel) {
      const d = byRel.get(rel);
      return d ? { display: toDisplay(d), sort: toSortKey(d) } : null;
    }
  });

  const indexPath = path.join(opts.out, INDEX_NAME);
  fs.writeFileSync(
    indexPath,
    JSON.stringify(tree, function (k, v) { return k === '_sort' ? undefined : v; }, 2) + '\n',
    'utf8'
  );

  // ---- 요약 (OB-1)
  process.stdout.write('발행 대상 ' + selected.length + '건 / 전체 .md ' + all.length + '건\n');
  for (const s of selected) {
    process.stdout.write('  ' + toDisplay(s.date) + '  (' + s.dateSource + ')  ' + s.rel + '\n');
  }
  process.stdout.write('경고 ' + warnings.length + '건\n');
  process.stdout.write('스테이징: ' + staging + '\n');
  process.stdout.write('인덱스:   ' + indexPath + '\n');
  return 0;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = {
  splitFrontmatter: splitFrontmatter,
  frontmatterEntries: frontmatterEntries,
  parseScalar: parseScalar,
  evaluatePublish: evaluatePublish,
  parseDateValue: parseDateValue,
  toIso: toIso,
  toDisplay: toDisplay,
  toSortKey: toSortKey,
  gitFirstAdded: gitFirstAdded,
  collectMarkdown: collectMarkdown,
  isExcludedDirDefault: isExcludedDirDefault,
  compareEntries: compareEntries,
  buildIndexTree: buildIndexTree,
  withIsoDate: withIsoDate,
  findAttachmentEmbeds: findAttachmentEmbeds,
  main: main
};
