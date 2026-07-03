# myBlog

Obsidian vault를 GitHub Pages 정적 블로그로 발행하는 개인 블로그 저장소. 별도 서버/백엔드 없이 정적 파일 + GitHub Actions만으로 동작한다.

## 무엇을 했는지

Obsidian으로 글을 쓰고 로컬에서 `update.bat`을 수동 실행해야만 블로그에 반영되던 워크플로에, **브라우저에서 직접 쓰고 저장하면 바로 반영되는 웹 에디터**를 추가했다. 동시에 그 반영 경로 자체가 실제로는 한 번도 정상 동작한 적이 없었던 파이프라인 버그를 함께 고쳤다.

### 1. 자동 반영 파이프라인 버그 수정 (`.github/workflows/gen-blog.yml`, `gen_blog.js`)

- **문제**: `blog/**` 변경 push 시 `gen_blog.js`를 실행해 `blog_files.js`를 재생성하고 자동 커밋하는 워크플로가 있었지만, 워크플로에 `permissions` 블록이 없어 기본 read-only 토큰으로는 `git push`가 항상 실패하고 있었다(전체 히스토리에 `github-actions[bot]` 커밋 0건으로 확인).
- **수정**: `permissions: contents: write`, `actions/checkout@v4`에 `fetch-depth: 0` 추가.
- **부수 문제**: 글 날짜를 파일 `mtime`으로 매겼는데, `actions/checkout`은 매번 체크아웃 시각으로 mtime을 초기화한다. 파이프라인이 실제로 push하기 시작하면 모든 글의 날짜와 노출 순서가 CI 실행 시각으로 수렴해버리는 문제가 있었다.
- **수정**: `gen_blog.js`의 날짜 산출을 `git log -1 --format=%aI -- <file>` 기반으로 변경(커밋 히스토리의 실제 작성 시각 사용), 아직 커밋되지 않은 새 파일(로컬 `update.bat` 흐름)은 `mtime`으로 폴백. 정렬 비교자도 동일한 날짜 소스를 쓰도록 통일(날짜만 고치고 정렬을 그대로 두면 그 자체로 노출 순서가 깨지기 때문).

### 2. 웹 에디터 신규 추가 (`write.html`, `write.js`)

Obsidian을 켜지 않고도 브라우저에서 `01. Diary` 폴더의 글을 쓰고 고칠 수 있는 숨김 페이지.

- **접근**: `/write.html` — 어떤 공개 페이지(`index.html`, `blog.html`, `about.html`)에도 링크되어 있지 않다. 주소를 아는 사람만 접근 가능(`noindex, nofollow`).
- **인증**: 서버가 없으므로 로그인 시스템 대신, 이 저장소 하나로 범위를 좁힌 GitHub **fine-grained PAT**(Contents: Read and write)을 브라우저 `localStorage`에 저장. 토큰이 없으면 에디터 UI 자체가 렌더링되지 않고 토큰 입력 폼만 보인다.
- **저장 방식**: 브라우저가 GitHub **Git Trees API**(blob → tree → commit → ref)를 직접 호출해 마크다운 글과 첨부 이미지를 **하나의 원자적 커밋**으로 처리한다. Contents API를 두 번 호출(이미지 커밋 → 본문 커밋)하는 방식과 달리, 워크플로가 두 번 트리거되는 레이스나 "이미지만 반영되고 본문은 실패" 같은 부분 실패가 구조적으로 발생하지 않는다. 저장 직전 브랜치 HEAD를 항상 새로 조회하며, 그 사이 다른 커밋이 push됐다면(non-fast-forward) 처음부터 자동 재시도한다.
- **호환성**: 파일명은 글 제목을 그대로 사용(ASCII slugify 없음 — `gen_blog.js`가 파일명을 제목으로 쓰기 때문). 이미지는 `blog.html`의 실제 렌더러(`marked` + Obsidian 전처리)가 이해하는 `![[900. image/파일명]]` 임베드 문법으로 삽입되며, 표준 마크다운 이미지 문법은 쓰지 않는다.
- **발행 확인**: 저장 후 GitHub Contents API로 `blog_files.js`의 `sha` 변화를 폴링해 "저장됨"과 "발행 완료"를 구분해 보여준다(CDN 캐시가 있는 raw/Pages URL 대신 Contents API를 쓰는 이유). 일정 시간 내 확인되지 않으면 Actions 탭 링크를 안내한다.

## 지금 할 수 있는 것

- `/write.html`에서 GitHub PAT을 한 번 입력해두면, 그 브라우저에서는 계속:
  - `01. Diary`의 기존 글 목록을 보고, 하나를 골라 불러와 수정 후 재저장할 수 있다.
  - 이미지를 첨부해 새 글을 작성하고 저장할 수 있다(제목/본문/이미지 → 저장 버튼 하나로 커밋까지 완료).
  - 저장 후 실제로 블로그에 반영("발행")됐는지 화면에서 바로 확인할 수 있다.
- 토큰을 지우면(`토큰 삭제` 버튼) 그 기기에서는 다시 토큰 입력 전까지 에디터가 보이지 않는다.
- 기존 Obsidian → `update.bat` → git push 흐름도 그대로 유효하다. 웹 에디터는 이 흐름을 대체하는 **또 다른 입력 경로**일 뿐, 기존 로컬 워크플로를 없애지 않았다.

## 아직 하지 못하는 것 / 이번 스코프 밖

- `01. Diary` 외 다른 폴더(`900. image`, `910. tutorial`, `999. withoutblog` 등)는 웹 에디터로 다루지 않는다 — Obsidian 전체 대체가 아니라 블로그 글쓰기만 대체한다.
- 여러 명이 쓰는 것을 가정하지 않는다(1인 전용, 권한/역할 개념 없음).
- 로그아웃 버튼 외의 토큰 관리(자동 만료, 기기 간 동기화)는 없다 — 기기마다 최초 1회 입력.
- Obsidian과 웹 에디터를 동시에 켜놓고 같은 글을 동시 편집하는 상황의 git 충돌은 고려하지 않는다.
- 글 제목(=파일명) 변경(rename)은 지원하지 않는다 — 기존 글 수정 시 제목 입력란은 비활성화된다.

## 검증 상태

날짜/정렬 로직과 에디터 코드는 로컬 정적 검증(단위 테스트 수준)과 코드 리뷰를 거쳤다. 다만 아래 두 가지는 실제 PAT과 실제 push가 필요해 **사람이 직접 확인해야 하는 항목**이다.

1. `blog/` 아래 실제 변경을 push했을 때 `github-actions[bot]` 커밋이 정상 생성되고, 기존 글들의 날짜/노출 순서가 회귀 없이 유지되는지.
2. 실제 fine-grained PAT으로 `/write.html`에 접속해 이미지 포함 글 작성 → 저장 → 발행 확인까지의 전체 흐름이 실제로 동작하는지.

## 구성 파일

| 파일 | 역할 |
|---|---|
| `gen_blog.js` | `blog/`를 스캔해 `blog_files.js`(글 트리 데이터) 생성 |
| `gen_about.js` | `blog/999. withoutblog/About.md`로 `about_content.js` 생성 |
| `blog.html` / `blog.js` | 블로그 글 목록/본문 렌더링 (마크다운 + Obsidian 문법 지원) |
| `index.html`, `about.html` | 메인/소개 페이지 |
| `write.html` / `write.js` | 비공개 웹 에디터 (신규) |
| `update.bat` | 로컬에서 gen 스크립트 실행 후 커밋/푸시하는 수동 스크립트 |
| `.github/workflows/gen-blog.yml` | `blog/**` push 시 `blog_files.js` 자동 재생성 및 커밋 |
