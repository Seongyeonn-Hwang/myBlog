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

---

## 주의사항

⚠️ **주의 1**: Vault가 Obsidian 앱에서 열려있을 때 CLI로 수정하면 충돌이 발생할 수 있습니다.

⚠️ **주의 2**: 파일 삭제 시 복구 불가능하므로 주의하세요.

⚠️ **주의 3**: 대용량 Vault에서 `search` 명령은 시간이 걸릴 수 있습니다.

---

## 리소스

- 📖 [Obsidian CLI GitHub](https://github.com/replit/obsidian-cli)
- 📚 [Obsidian 공식 문서](https://help.obsidian.md)
- 🔗 [npm Obsidian CLI](https://www.npmjs.com/package/@replit/obsidian-cli)
