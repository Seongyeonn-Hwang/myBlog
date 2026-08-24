# myBlog

정적 파일 + GitHub Actions만으로 동작하는 개인 블로그. 빌드 도구 없이 순수 HTML/CSS/JS.

- 사이트: https://seongyeonn-hwang.github.io/myBlog/

## 저장소 구조 (2026-08-24 리팩토링 이후)

**저장소 하나**에 Obsidian vault 원본과 사이트 코드가 함께 있다. 대신 **배포되는 것은 `_site/`뿐**이다.

```
myBlog/
├ vault/                       Obsidian vault. 여기서 글을 쓴다. 서빙되지 않는다.
├ blog.html  index.html  about.html  visitor_report.html
├ blog.css   style.css   font/  image/
├ mirror.js                    publish:true 인 .md 선별 + blog_index.json 생성
├ build.sh                     _site/ 조립 + 경계 검증  ← CI와 로컬이 같은 걸 쓴다
└ .github/workflows/pages.yml  build.sh 실행 → _site/ 만 업로드 → 배포
```

### 발행 흐름

```
vault/ 에서 글 작성 (frontmatter 에 publish: true)
  └ master 로 push
      └ pages.yml
          ├ node mirror.js --vault vault --out _build
          │     publish:true 인 .md만 선별 · 날짜 확정 · blog_index.json 생성
          ├ _site/ 조립 (사이트 자산 화이트리스트 + blog/*.md + blog_index.json)
          ├ 가드: 화이트리스트 밖 항목·.md 아닌 파일이 있으면 exit 1
          └ upload-pages-artifact  path: '_site'   ← 유일한 공개 경계
                └ deploy-pages
```

**생성물은 저장소에 커밋되지 않는다.** `_site/`·`_build/`는 gitignore되어 있고 매 배포마다 새로 만들어진다. 예전 `blog_files.js`처럼 본문이 히스토리에 박제되는 일이 없다.

### 왜 저장소가 하나인가

이전 계획은 vault를 별도 private 저장소로 분리하고 deploy key로 공개 저장소에 미러링하는 2-저장소 구조였다. 그 구조를 택했던 유일한 이유는 **GitHub Pages 무료 플랜이 public 저장소를 요구**했기 때문이다.

GitHub Pro를 쓰면 private 저장소에서도 Pages를 배포할 수 있어 그 제약이 사라진다. 그래서 저장소를 하나로 합치고, deploy key·cross-repo push·시크릿을 전부 없앴다.

**주의: 저장소가 private이어도 Pages 사이트는 공개다.** 사이트 접근 제어는 Enterprise Cloud 기능이라 Pro에는 없다. 따라서 `publish: true` 옵트인 게이트는 여전히 필수다. 저장소를 private으로 만드는 것은 "저장소 열람"을 막을 뿐 "사이트 서빙"을 막지 않는다.

## `publish: true` 사용법

vault의 `.md` frontmatter에 다음을 넣은 글만 공개된다.

```markdown
---
publish: true
date: 2026-01-23
---

# 글 제목
```

- **boolean `true`만 인정한다.** `"true"`(따옴표), `yes`, `1`, 키 누락은 전부 비발행이다. 실수의 방향을 항상 "안 올라감"으로 고정하기 위해 일부러 좁게 잡았다.
- 오타(`publish : true` 등)는 조용히 넘어가지 않고 빌드 로그에 경고로 남는다.
- `date:`가 없으면 git 최초 추가 시각을 쓴다. 그래서 `pages.yml`은 `fetch-depth: 0`으로 클론한다.
- **데일리 노트는 `publish: true`가 있어도 거부하고 빌드를 실패시킨다.**
- `91.Templates/**`와 `.obsidian/**`은 스캔 대상이 아니다.
- **첨부(이미지·mp3·pdf)는 미러링되지 않는다.** `![[...]]`로 비-md 첨부를 임베드한 글을 발행하면 빌드가 경고한다.

발행을 내리려면 `publish: true`를 지우고 push하면 된다. 다음 빌드에서 `_site/`에 포함되지 않는다.

## `(!보안)` 마스킹에 대한 주의

`(!보안)…(보안!)` 마스킹은 **보안 통제가 아니라 표시 효과**다. `blog.html`이 브라우저에서 가리는 것뿐이고, 원본 `.md`는 그대로 서빙되므로 URL로 직접 열면 다 보인다. 공개하면 안 되는 내용은 애초에 `publish: true`를 붙이지 않는 것이 유일한 통제다.

## 로컬 미리보기

CI와 **똑같은 스크립트**를 돌린다. 배포 전에 결과를 눈으로 확인할 수 있다.

```bash
./build.sh              # vault/ 를 읽어 _site/ 를 만든다
npx serve _site         # http://localhost:3000
```

다른 vault 루트로 시험하려면 `VAULT=blog ./build.sh` 처럼 지정한다.

`file://`로 `blog.html`을 직접 열면 CORS 때문에 목록을 못 불러온다. 반드시 정적 서버로 열어야 한다(`blog.html`이 그 사유를 화면에 표시한다).

## 지난 유출에 대한 감사 기록 및 대응 방침

`origin/master`에서 도달 가능한 이 repo의 히스토리에는 다음이 **공개되어 있었다**(측정: `git -c core.quotepath=false log --all --diff-filter=A --name-only --format="" | sort -u`, 전 원격 브랜치 포함).

- 데일리 노트 47개
- 카드 이용내역 `.xlsx` 2건
- 결제·항공권 `.pdf` 3건
- Claude 대화 전문 `.jsonl` 3건 (약 240KB)
- Obsidian 설정(`.obsidian/**`) 45개
- 총 251개 경로 (md 107, png 30, exe 6, xlsx 2, pdf 3 등)

**대응 방침이 2026-08-24에 바뀌었다.** 당초에는 "수용하고 앞으로만 막는다"였다 — 히스토리 재작성 없이는 지울 수 없다고 봤기 때문이다. 그런데 이 저장소는 fork 0개·star 0개라, **GitHub Pro 구독 후 private으로 전환하면 히스토리를 건드리지 않고도 이 유출이 닫힌다.** 분리될 공개 fork 네트워크가 없다.

이미 크롤링·캐시된 부분은 되돌릴 수 없지만 노출 창구 자체는 없어진다. `git filter-repo`·force-push는 여전히 하지 않는다.

**자격증명 회전은 필요 없다.** 두 가지를 확인했다.

- 히스토리에 공개된 `.obsidian/plugins/*/data.json` 7개에 `openAIAPIToken`·`taskboneAPIkey`·`personalAccessToken` 등 키 계열 필드가 있으나 **값이 전부 빈 문자열**이었다.
- 로컬 vault의 `99. ETC/암호.md`에는 실제 id/pw가 평문으로 있지만 **히스토리에 들어간 적이 없다**(`git log --all -S'밀리의 서재'`, `-S'- pw :'`, `blog_files.js` 전 리비전 전수 검사 모두 0건). 본문을 통째로 박제하던 `blog_files.js` 구조에서도 살아남았다.

## 아직 없는 것

- 브라우저에서 직접 글을 쓰는 웹 에디터(`write.html`)는 vault 분리 이전 버전의 커밋 히스토리에 남아있다. 필요해지면 새 구조에 맞춰 다시 만들어야 한다.
- 여러 명이 쓰는 것을 가정하지 않는다(1인 전용).

## 정정: 예전 버전 문서와의 차이

- **글 날짜 기준이 바뀌었다.** 예전 `README.md`(2026-07-07 작업 로그 당시)는 "글 날짜는 `git log`상 해당 파일의 **첫 커밋 시각** 기준"이라고 적어뒀지만, 실제 당시 코드(`gen_blog.js`의 `git log -1 --format=%aI`)는 **가장 최근 커밋** 시각을 사용했다 — 문서와 구현이 처음부터 어긋나 있었다. `gen_blog.js`는 폐지됐고, 이제 날짜는 `mirror.js`가 frontmatter의 `date:`(없으면 `git log --diff-filter=A ... | tail -1`, 즉 최초 커밋)에서 가져온다.
- **`9\d{2}` 폴더 제외 필터는 2자리 번호를 걸러내지 못했다.** 예전 `gen_blog.js`는 `9`로 시작하는 폴더를 발행 대상에서 빼려 했는데, 실제 정규식(`/^9\d{2}[. ]/`)은 숫자 **3자리**를 요구해 `90. Files`·`91.Templates`·`99. ETC` 같은 2자리 폴더는 걸러지지 않았다. 새 구조에서는 `publish: true` 옵트인이 발행 여부를 결정하므로 문제 자체가 사라졌다.
- **2-저장소 계획은 폐기됐다.** 2026-08-23 시점 문서는 `myBlog-vault`라는 별도 private 저장소와 deploy key 미러링을 전제로 쓰여 있었다. GitHub Pro 도입으로 단일 저장소로 대체됐고, 그 저장소는 생성되지 않았다.

## 작업 로그

### 2026-08-24 — 단일 private 저장소 + 무커밋 빌드

2-저장소 미러링 계획을 GitHub Pro 기반 단일 저장소로 대체했다.

1. `mirror.js`를 저장소 루트로 옮기고 `build.sh`를 추가해 조립·검증을 한곳에 모았다. CI(`pages.yml`)가 이 스크립트를 그대로 호출하므로 로컬에서 배포 결과를 재현할 수 있다.
2. `pages.yml`의 `path: '.'`를 `path: '_site'`로 바꿨다. **이 한 줄이 공개 경계다.** `build.sh`가 화이트리스트 밖의 항목을 발견하면 배포 대신 빌드가 실패한다.
3. **vault는 새로 만든다.** 기존 100개 노트를 옮기지 않고, 블로그에 올릴 글만 `vault/`로 이동한다. 개인 노트(데일리 노트 47개, mp3 127개, `99. ETC/암호.md`)는 로컬 Obsidian에 남는다. 유출 표면이 구조적으로 작아지고, mtime 기반 날짜 백필이라는 취약한 단계가 제거된다.
4. **저장소가 public인 동안에는 실제 vault를 커밋하지 않는다.** 현재 `vault/`에 있는 것은 파이프라인 검증용 미끼다. `/blog/`는 gitignore로 막혀 있다.

### 2026-08-23 — vault 재분리 + 본문 번들 폐지

2026-07-07 재구성 이후 `blog/`가 다시 실사용 Obsidian vault로 채워지면서 같은 문제가 재발할 조짐이 보였다(`update.bat`의 `git add .`가 vault 전체를 스테이징할 수 있는 상태). `gen_blog.js`·`blog_files.js`(본문이 그대로 박제된 생성 파일)·`watch.js`·`update.bat`·`.github/workflows/gen-blog.yml`을 모두 폐지하고, `blog.html`이 `blog_index.json`을 fetch한 뒤 본문을 `.md`에서 직접 가져오도록 바꿨다.

### 2026-07-07 — 최초 vault 분리

원래 `blog/` 폴더는 Obsidian vault 전체(`.obsidian` 설정, 플러그인, 개인 다이어리/메모)였고, `gen_blog.js`가 그 안을 스캔해 블로그에 필요한 글만 걸러 보여주는 구조였다. vault 설정 파일과 개인 메모가 공개 저장소 히스토리에 그대로 커밋되고 있었던 게 문제였고, 블로그 자체도 처음부터 새로 만들기로 결정했다.

1. **Obsidian vault 분리**: `blog/`(당시 vault 전체, 추적 파일 102개)를 `obsidian-vault/`로 이동하고 `.gitignore`에 등록해 git 추적에서 완전히 제외. `.omc/`도 같은 이유로 함께 gitignore 처리.
2. **새 블로그 스펙**: 빌드 도구 없는 순수 HTML/CSS/JS + GitHub Pages 유지, 콘텐츠는 빈 상태로 시작, 웹 에디터는 범위에서 제외.
3. **`blog/` 이름 재사용**: vault가 빠지면서 비게 된 `blog/`를 새 블로그의 마크다운 소스 폴더로 다시 사용.
4. **죽은 코드 정리**: 아무 HTML에서도 참조하지 않던 `blog.js`, `posts.js`, `gen_posts.js` 삭제. `about.html`의 사진 그리드 제거, `about_content.js`/`gen_about.js` 삭제.

## 다른 PC에서 이어가기

- **git에 있음** (clone/pull로 충분): 사이트 코드 전체, `vault/`, `mirror.js`, `build.sh`, 이 `README.md`, `.gitignore`.
- **git에 없음**: `_site/`·`_build/`(빌드하면 생김), `/blog/`(로컬 전용 vault 잔여물), `.omc/`.

빌드에 필요한 것은 Node 20 하나뿐이다. 의존성 설치가 없다.
