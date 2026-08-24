#!/usr/bin/env node
'use strict';

/*
 * publish.js — 예전 vault 의 글을 블로그용 blog_vault/ 로 옮긴다.
 *
 * frontmatter 를 손으로 쓰다 보면 `publish: "true"` 처럼 발행되지 않는 형태로
 * 적기 쉽다. mirror.js 는 boolean true 만 인정한다. 이 스크립트가 그걸 대신 쓴다.
 *
 * 사용법
 *   node publish.js "03. Resources/Programming/클래스(class).md"
 *   node publish.js --list                    옮길 수 있는 후보를 날짜와 함께 출력
 *   node publish.js --dry-run "<경로>"        무엇을 쓸지만 보여주고 파일은 안 건드림
 *   SRC=다른폴더 node publish.js "<경로>"      원본 vault 위치 지정
 *
 * 날짜는 파일 mtime 에서 가져온다. git 히스토리에 없는 글이라 이게 유일한 단서다.
 * 옮긴 뒤에는 vault/ 쪽이 원본이 되므로, 이후 수정은 vault/ 에서 한다.
 */

const fs   = require('fs');
const path = require('path');

const SRC  = process.env.SRC || "../myBlog-이전볼트-백업";
const DEST = 'blog_vault';

const DAILY_RE     = /(^|\/)daily notes\//i;
const TEMPLATES_RE = /^91\s*\.?\s*templates$/i;

function die(msg) { process.stderr.write('오류: ' + msg + '\n'); process.exit(1); }

function candidates() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (TEMPLATES_RE.test(e.name) || /^daily notes$/i.test(e.name)) continue;
        walk(p);
      } else if (e.name.endsWith('.md')) {
        const rel = path.relative(SRC, p).split(path.sep).join('/');
        out.push({ rel, date: fs.statSync(p).mtime, moved: fs.existsSync(path.join(DEST, rel)) });
      }
    }
  })(SRC);
  return out.sort((a, b) => b.date - a.date);
}

function iso(d) {
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

// frontmatter 가 있으면 publish/date 만 채워 넣고, 없으면 새로 앞에 붙인다.
// 기존 키는 덮어쓰지 않는다 — date 를 손으로 고쳐놨다면 그대로 둔다.
function withFrontmatter(raw, date) {
  const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(raw);
  if (!m) {
    return ['---', 'publish: true', 'date: ' + date, '---', ''].join(nl) + nl + raw;
  }
  const body  = m[1];
  const lines = body.split(/\r?\n/);
  const has   = k => lines.some(l => new RegExp('^\s*' + k + '\s*:').test(l));
  const add   = [];
  if (!has('publish')) add.push('publish: true');
  if (!has('date'))    add.push('date: ' + date);

  // publish 가 있는데 boolean true 가 아니면 발행되지 않는다. 그 자리를 고쳐준다.
  const fixed = lines.map(l =>
    /^\s*publish\s*:/.test(l) && !/^\s*publish\s*:\s*true\s*$/.test(l)
      ? 'publish: true'
      : l);

  return ['---', ...add, ...fixed, '---', ''].join(nl) + raw.slice(m[0].length);
}

function main(argv) {
  const dry  = argv.includes('--dry-run');
  const rest = argv.filter(a => a !== '--dry-run');

  if (!fs.existsSync(SRC)) die(`원본 vault 가 없습니다: ${SRC}/  (SRC 환경변수로 지정 가능)`);

  if (rest[0] === '--list' || rest.length === 0) {
    const list = candidates();
    process.stdout.write(`${SRC}/ 의 발행 후보 ${list.length}건 (데일리 노트·템플릿 제외)\n\n`);
    for (const c of list) {
      process.stdout.write(`${c.moved ? '[옮김] ' : '       '}${iso(c.date)}  ${c.rel}\n`);
    }
    process.stdout.write('\n옮기기:  node publish.js "<위 경로>"\n');
    return 0;
  }

  let moved = 0;
  for (const rel of rest) {
    const from = path.join(SRC, rel);
    if (!fs.existsSync(from))     die(`파일이 없습니다: ${from}`);
    if (!rel.endsWith('.md'))     die(`.md 가 아닙니다: ${rel}`);
    if (DAILY_RE.test('/' + rel)) die(`데일리 노트는 발행할 수 없습니다: ${rel}`);
    if (rel.split('/').some(s => TEMPLATES_RE.test(s))) die(`템플릿은 발행 대상이 아닙니다: ${rel}`);

    const raw  = fs.readFileSync(from, 'utf8');
    const date = iso(fs.statSync(from).mtime);
    const next = withFrontmatter(raw, date);
    const to   = path.join(DEST, rel);

    // 첨부는 미러링되지 않는다. 깨질 임베드를 미리 알린다.
    const embeds = [...raw.matchAll(/!\[\[([^\]|#\n]+?)(?:[|#][^\]\n]*)?\]\]/g)]
      .map(m => m[1].trim())
      .filter(t => !t.toLowerCase().endsWith('.md'));
    if (embeds.length) {
      process.stderr.write(`[경고] ${rel}: 첨부 임베드 ${embeds.length}건은 사이트에서 깨집니다 — ${embeds.slice(0, 3).join(', ')}\n`);
    }
    if (/```\s*dataviewjs/i.test(raw)) {
      process.stderr.write(`[경고] ${rel}: dataviewjs 블록은 Obsidian 전용이라 사이트에서 코드로 보입니다.\n`);
    }

    if (dry) {
      process.stdout.write(`[dry-run] ${to}  (date: ${date})\n`);
      continue;
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, next, 'utf8');
    process.stdout.write(`옮김: ${to}  (date: ${date})\n`);
    moved++;
  }

  if (moved) process.stdout.write(`\n${moved}건 옮겼습니다. 확인:  ./build.sh && npx serve _site\n`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
