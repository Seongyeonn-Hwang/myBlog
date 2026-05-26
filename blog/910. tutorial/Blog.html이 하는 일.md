 blog.html 인라인 스크립트 기능 정리

  1. 전처리 함수들

  - stripFrontmatter — --- 프론트매터 제거
  - stripDataviewjs — ```dataviewjs ``` 블록 제거 (Obsidian 전용 코드)
  - hideSensitiveContent — (!보안)내용(보안!) → ■ 마스킹

  2. 상태 태그 배지 (applyStatusTags)

  - (delay) / (working) / (pending) / (important) → 컬러 배지로 변환 (대소문자 무관)

  3. Obsidian 문법 전처리 (obsidianPreprocess)

  - ![[파일]] 임베드 → 무시 (제거)
  - [[파일명]] / [[파일명|별칭]] 위키링크 → 클릭 가능한 링크로 변환, 파일 없으면 회색 미싱 스타일
  - ==하이라이트== → <mark> 태그
  - Callout 블록 — > [!NOTE], [!WARNING], [!DANGER] 등 14가지 타입 지원 → 스타일된 박스로 렌더링

  4. 콘텐츠 렌더링 파이프라인 (renderContent)

  전처리를 순서대로 조합:
  stripFrontmatter → stripDataviewjs → hideSensitiveContent
  → applyStatusTags → obsidianPreprocess → marked.parse()
  최종 렌더링은 외부 라이브러리 marked.js 사용

  5. 파일 트리 (buildTree)

  - blog_files.js의 BLOG_FILES 데이터를 ASCII 트리로 렌더링
  - 폴더는 [+]/[-] 클릭으로 접기/펼치기
  - 파일 클릭 시 읽기 화면으로 전환
  - 파일/폴더에 날짜 표시 및 7일 이내 파일이면 ✦ New 배지 표시 (isNew)

  6. 파일 열기 / 뷰 전환 (openFile / showList)

  - 목록 화면 ↔ 읽기 화면 전환
  - history.pushState로 브라우저 뒤로가기 지원
  - 위키링크 클릭 시 해당 파일로 바로 이동

  7. Habit Tracker 특별 렌더링

  - 파일명이 Habit Tracker일 때 전용 UI로 렌더링
  - ## 섹션명 기준으로 습관 파싱, 날짜 목록에서 달성 여부 계산
  - GitHub 잔디 스타일의 연간 도트 그리드 렌더링
  - 오늘 날짜는 파란 점, 달성일은 초록 점
  - 연속 streak 일수 계산 및 표시

  8. 파일 인덱싱 (indexFiles)

  - 전체 파일을 fileMap에 등록 → 위키링크 연결에 사용