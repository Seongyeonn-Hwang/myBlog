# myBlog

정적 파일 + GitHub Actions만으로 동작하는 개인 블로그. 빌드 도구 없이 순수 HTML/CSS/JS.

## 구조

| 경로 | 역할 |
|---|---|
| `blog/` | 블로그 글 원본(마크다운). 파일명이 곧 글 제목. |
| `gen_blog.js` | `blog/`를 스캔해 `blog_files.js`(글 트리 데이터) 생성 |
| `blog_files.js` | 생성된 글 데이터 (커밋됨, 자동 갱신) |
| `blog.html` | 글 목록/본문 렌더링 (marked.js + Obsidian 문법 일부 지원: `[[wiki link]]`, `![[embed]]`, callout, 하이라이트 등) |
| `index.html` | 메인/프로필 페이지 |
| `about.html` | 소개 페이지 (직접 편집) |
| `update.bat` | 로컬에서 `gen_blog.js` 실행 후 커밋/푸시하는 수동 스크립트 |
| `watch.js` | `blog/` 변경 감지 시 자동으로 `gen_blog.js` 재실행 (로컬 개발용) |
| `.github/workflows/gen-blog.yml` | `blog/**` push 시 `blog_files.js` 자동 재생성 및 커밋 |
| `.github/workflows/pages.yml` | GitHub Pages 배포 |
| `obsidian-vault/` | 예전 Obsidian vault 전체. git에서 추적하지 않음(`.gitignore`). 블로그와 무관한 개인 메모용 로컬 폴더. |

## 글 쓰는 법

1. `blog/` 폴더 안에 `.md` 파일을 만든다. 파일명이 곧 글 제목이 된다.
2. 이미지는 표준 마크다운(`![alt](경로)`) 또는 Obsidian 임베드(`![[파일명]]`, `blog/` 기준 상대경로) 문법을 쓸 수 있다.
3. `update.bat` 실행 → 커밋 메시지 입력 → push. 또는 그냥 `blog/**` 변경을 push하면 GitHub Actions가 `blog_files.js`를 자동으로 재생성하고 `github-actions[bot]` 이름으로 커밋한다.
4. 글 날짜는 `git log`상 해당 파일의 첫 커밋 시각 기준(체크아웃 시각으로 뒤집히지 않도록). 아직 커밋 안 된 새 파일은 로컬 `mtime`으로 임시 표시된다.

## 아직 없는 것

- 브라우저에서 직접 글을 쓰는 웹 에디터(`write.html`)는 이번 재구성에서 제외했다. 이전 버전 커밋 히스토리에는 남아있으며, 필요해지면 새 `blog/` 구조에 맞춰 다시 만들 예정.
- 여러 명이 쓰는 것을 가정하지 않는다(1인 전용).

## 작업 로그 (2026-07-07)

### 배경

원래 `blog/` 폴더는 Obsidian vault 전체(`.obsidian` 설정, 플러그인, 개인 다이어리/메모)였고, `gen_blog.js`가 그 안을 스캔해 블로그에 필요한 글만 걸러 보여주는 구조였다. vault 설정 파일과 개인 메모가 공개 저장소 히스토리에 그대로 커밋되고 있었던 게 문제였고, 블로그 자체도 처음부터 새로 만들기로 결정했다.

### 결정한 것

1. **Obsidian vault 분리**: `blog/`(당시 vault 전체, 추적 파일 102개)를 `obsidian-vault/`로 이동하고 `.gitignore`에 등록해 git 추적에서 완전히 제외. `.omc/`(Claude Code 세션/플랜 상태)도 같은 이유로 함께 gitignore 처리.
2. **새 블로그 스펙** (사용자 확인 후 확정):
   - 기술 스택: 빌드 도구 없는 순수 HTML/CSS/JS + GitHub Pages 유지 (프레임워크 도입 안 함)
   - 콘텐츠: 빈 상태로 시작, 샘플 글 2개만 채워둠
   - 웹 에디터(`write.html`/`write.js`): 이번 작업 범위에서 제외, 나중에 새 `blog/` 구조에 맞춰 별도로 재작업
3. **`blog/` 이름 재사용**: vault가 빠지면서 비게 된 `blog/`를 새 블로그의 마크다운 소스 폴더로 다시 사용. 덕분에 `gen_blog.js`, `watch.js`, `.github/workflows/gen-blog.yml`은 이미 `blog/` 경로를 보고 있어 **코드 변경 없이 그대로 재사용** 가능했음.
4. **죽은 코드 정리**: 아무 HTML에서도 참조하지 않던 `blog.js`, `posts.js`, `gen_posts.js` 삭제. `about.html`의 사진 그리드는 사라진 vault의 `About.md` 이미지에 의존하고 있어서 제거하고 텍스트 placeholder로 교체, `about_content.js`/`gen_about.js`도 함께 삭제, `update.bat`에서 관련 호출 제거.
5. 커밋 `7277003`으로 push 완료. 로컬 정적 서버로 `index.html`/`about.html`/`blog.html`/`blog_files.js`가 200으로 응답하는 것까지 확인했지만, **브라우저에서 실제 마크다운 렌더링(표/callout 등)은 도구 환경에 브라우저가 없어 직접 확인하지 못함** — 사용자가 육안 확인 필요.

### 다른 PC에서 이어가기

git으로 clone/pull하면 자동으로 따라오는 것과 아닌 것을 구분해야 한다.

- **git에 있음** (clone/pull로 충분): 사이트 코드 전체, `blog/` 안의 글, 이 `README.md`, `.gitignore`, `.claude/settings.local.json`.
- **git에 없음** (`.gitignore`로 제외됨, 로컬에만 존재):
  - `obsidian-vault/` — 예전 vault. 다른 PC에서도 필요하면 직접 복사하거나 별도 동기화 수단(Obsidian Sync, Syncthing, 별도 비공개 저장소 등) 필요.
  - `.omc/` — Claude Code(OMC)의 세션/플랜 상태. 이 PC에만 존재.
  - Claude와의 대화 memory(`C:\Users\<user>\.claude\...`)도 PC별 로컬 저장이라, 다른 PC에서 Claude Code를 켜면 이 대화 맥락 없이 새 세션으로 시작된다 — 이 로그가 그 공백을 메우는 용도.
