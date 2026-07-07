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
