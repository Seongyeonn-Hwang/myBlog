# Obsidian CLI 사용 가이드

## 개요
Obsidian CLI는 커맨드 라인에서 Obsidian vault를 관리할 수 있는 도구입니다.

---

## 설치 및 설정

### 1. 설치
```bash
npm install -g @replit/obsidian-cli
```

### 2. Vault 초기화
```bash
obsidian init [vault-name]
```

### 3. Vault 설정
```bash
obsidian config set vault [vault-path]
```

---

## 주요 명령어

### 파일 관리

#### 파일 생성
```bash
obsidian create [file-name]
obsidian create [folder/file-name]
```

#### 파일 읽기
```bash
obsidian read [file-name]
obsidian read [folder/file-name]
```

#### 파일 수정
```bash
obsidian edit [file-name]
# 파일을 기본 편집기에서 엽니다
```

#### 파일 목록 조회
```bash
obsidian list
obsidian list [folder]
```

#### 파일 삭제
```bash
obsidian delete [file-name]
```

### 검색 및 쿼리

#### 파일 검색
```bash
obsidian search [keyword]
obsidian search [keyword] --folder [folder-path]
```

#### 태그로 검색
```bash
obsidian search --tag [tag-name]
```

#### 링크 검색
```bash
obsidian links [file-name]      # 해당 파일이 참조하는 링크
obsidian backlinks [file-name]  # 해당 파일을 참조하는 파일들
```

### Vault 관리

#### Vault 상태 확인
```bash
obsidian status
```

#### Vault 동기화
```bash
obsidian sync
```

#### Vault 통계
```bash
obsidian stats
# 파일 수, 단어 수, 태그 수 등 표시
```

---

## 삭제된 파일 복구하기

### 방법 1: 휴지통 (시스템 휴지통)
**Windows:**
1. Obsidian에서 파일 삭제 시 휴지통으로 이동
2. 파일 탐색기 > 휴지통 열기
3. 삭제된 파일 찾기 > 마우스 우클릭 > "복원"

**macOS:**
1. Finder > 휴지통 열기
2. 삭제된 파일 찾기 > 마우스 우클릭 > "원위치로 되돌리기"

**Linux:**
- 파일 관리자의 휴지통 폴더 접근

### 방법 2: Git 버전 관리 (추천)
Vault를 Git으로 관리하고 있다면:

```bash
# 삭제된 파일 목록 확인
git log --diff-filter=D --summary | grep delete

# 특정 파일 복구
git checkout <commit-hash>^ -- [file-path]

# 또는 이전 버전에서 파일 복구
git restore [file-path]
```

### 방법 3: .obsidian 내 임시 파일 확인
Obsidian이 백업한 임시 파일 확인:

```bash
# .obsidian/app.json 또는 .obsidian/cache 폴더 확인
ls -la .obsidian/
```

### 방법 4: 클라우드 동기화 서비스
Obsidian Sync, iCloud, Google Drive, Dropbox 등 사용:

1. 동기화 서비스의 버전 관리 or 휴지통 확인
2. 이전 버전 복원 또는 삭제된 파일 복구

**예시 (Google Drive):**
- Google Drive 웹사이트 > 휴지통
- 복구할 파일 찾기 > 우클릭 > "복원"

### 방법 5: 로컬 백업 폴더 확인
정기적으로 vault 백업을 만들었다면:

```bash
# 백업 폴더에서 파일 찾기
find ~/backups -name "[file-name]" -type f

# 백업에서 복사
cp ~/backups/vault-backup-[date]/[file-path] ./[file-path]
```

---

## 고급 사용법

### 1. 자동화 스크립트
```bash
# 매일 새 일일 노트 생성
obsidian create "daily/$(date +%Y-%m-%d).md"
```

### 2. 배치 작업
```bash
# 폴더의 모든 파일에 태그 추가
for file in folder/*.md; do
  obsidian edit "$file" --prepend "#tag-name"
done
```

### 3. 데이터 내보내기
```bash
obsidian export [format]  # html, pdf, json 등
```

---

## 유용한 플래그

| 플래그 | 설명 |
|--------|------|
| `--quiet` | 출력 최소화 |
| `--verbose` | 상세 정보 출력 |
| `--format [format]` | 출력 형식 지정 (json, table, csv) |
| `--recursive` / `-r` | 하위 폴더 포함 |
| `--output [file]` | 결과를 파일로 저장 |

---

## 팁 & 트릭

✅ **팁 1**: 복잡한 작업은 쉘 스크립트로 자동화하세요.
```bash
#!/bin/bash
for file in notes/*.md; do
  obsidian read "$file" | grep "TODO" && echo "$file"
done
```

✅ **팁 2**: alias를 설정하여 단축 명령 만들기
```bash
alias on='obsidian'
alias onc='obsidian create'
alias onr='obsidian read'
```

✅ **팁 3**: 버전 확인
```bash
obsidian --version
```

✅ **팁 4**: 도움말 보기
```bash
obsidian --help
obsidian [command] --help
```

✅ **팁 5**: Git으로 삭제 이력 관리
```bash
# vault를 git으로 관리하면 언제든 복구 가능
git init
git add .
git commit -m "Initial commit"
```

---

## 주의사항

⚠️ **주의 1**: Vault가 Obsidian 앱에서 열려있을 때 CLI로 수정하면 충돌이 발생할 수 있습니다.

⚠️ **주의 2**: 파일 삭제 시 시스템 휴지통에 먼저 들어갑니다. 휴지통을 비우기 전에 복구 가능합니다.

⚠️ **주의 3**: 대용량 Vault에서 `search` 명령은 시간이 걸릴 수 있습니다.

⚠️ **주의 4**: Git으로 관리하지 않는 파일은 복구가 어려울 수 있으므로 정기 백업을 권장합니다.

---

## 리소스

- 📖 [Obsidian CLI GitHub](https://github.com/replit/obsidian-cli)
- 📚 [Obsidian 공식 문서](https://help.obsidian.md)
- 🔗 [npm Obsidian CLI](https://www.npmjs.com/package/@replit/obsidian-cli)
- 🔄 [Git 버전 관리](https://git-scm.com/doc)
