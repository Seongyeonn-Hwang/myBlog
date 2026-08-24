#!/usr/bin/env bash
#
# build.sh — 배포 아티팩트(_site/)를 조립한다.
#
# CI(.github/workflows/pages.yml)와 로컬이 "똑같은" 스크립트를 쓴다.
# 워크플로에 조립 로직을 인라인으로 적으면 로컬에서 재현할 수 없고,
# 그러면 배포된 결과를 눈으로 보기 전까지 아무것도 확인할 수 없다.
#
# 사용법
#   ./build.sh                  vault/ 를 읽어 _site/ 를 만든다
#   VAULT=blog ./build.sh       다른 vault 루트로 (실제 vault 로컬 테스트용)
#
# 이 저장소는 vault 원본과 사이트 코드를 한곳에 둔다. 따라서
# **_site/ 에 무엇을 넣느냐가 공개/비공개를 가르는 유일한 경계**다.
# 아래 SITE_ASSETS 는 화이트리스트다. `cp -a .` 같은 건 절대 쓰지 않는다.
# 경계가 뚫리면 조용히 배포되는 대신 여기서 exit 1 로 죽는다.

set -euo pipefail

VAULT="${VAULT:-blog_vault}"
OUT="_site"
WORK="_build"

# _site 최상위에 허용되는 항목. 여기 없는 건 배포되지 않는다.
SITE_ASSETS=(
  index.html
  about.html
  blog.html
  visitor_report.html
  blog.css
  style.css
  font
  image
)
# 위 자산 + mirror.js 가 만드는 생성물.
ALLOWED_TOP=("${SITE_ASSETS[@]}" blog blog_index.json)

die() { echo "::error::$*" >&2; exit 1; }

[ -d "$VAULT" ] || die "vault 디렉터리가 없습니다: $VAULT"

rm -rf "$OUT" "$WORK"
mkdir -p "$OUT" "$WORK"

# ---------------------------------------------------------------- 1. 선별
# publish: true 인 .md 만 고르고, 날짜를 확정해 frontmatter에 ISO로 주입하고,
# blog_index.json(본문 없음)을 만든다. 데일리 노트 거부·날짜 확정 실패는 exit 1.
echo "--- mirror.js ---"
node mirror.js --vault "$VAULT" --out "$WORK"

# ---------------------------------------------------------------- 2. 조립
echo "--- _site 조립 ---"
for a in "${SITE_ASSETS[@]}"; do
  [ -e "$a" ] || die "사이트 자산이 없습니다: $a"
  cp -a "$a" "$OUT/"
done

mkdir -p "$OUT/blog"
if [ -d "$WORK/_staging" ] && [ -n "$(ls -A "$WORK/_staging" 2>/dev/null || true)" ]; then
  cp -a "$WORK/_staging/." "$OUT/blog/"
else
  echo "발행 대상 0건 — blog/ 는 README.md 만 남습니다."
fi

[ -f "$WORK/blog_index.json" ] || die "blog_index.json 이 생성되지 않았습니다."
cp "$WORK/blog_index.json" "$OUT/blog_index.json"

# blog/ 는 매 빌드 재생성되므로 안내문도 매번 다시 쓴다.
cat > "$OUT/blog/README.md" <<'READMEEOF'
# 이 폴더는 자동 생성됩니다

여기의 `.md` 는 vault 에서 frontmatter 에 `publish: true` 가 붙은 글만
빌드 시점에 복사된 것입니다. 저장소에 커밋되지 않으며 매 배포마다 새로 만들어집니다.

`(!보안)` 마스킹은 보안 통제가 아니라 표시 효과입니다.
READMEEOF

# ---------------------------------------------------------------- 3. 가드
echo "--- 경계 검증 ---"

# (a) _site 최상위에 화이트리스트 밖의 항목이 있으면 실패.
while IFS= read -r entry; do
  [ -n "$entry" ] || continue
  ok=0
  for allowed in "${ALLOWED_TOP[@]}"; do
    [ "$entry" = "$allowed" ] && { ok=1; break; }
  done
  [ "$ok" = 1 ] || die "_site 최상위에 허용되지 않은 항목이 있습니다: $entry"
done < <(ls -A "$OUT")

# (b) blog/ 에 .md 아닌 파일이 섞이면 실패. 첨부는 미러링 대상이 아니다.
STRAY="$(find "$OUT/blog" -type f ! -name '*.md' || true)"
[ -z "$STRAY" ] || die "_site/blog 에 .md 가 아닌 파일이 있습니다:"$'\n'"$STRAY"

# (c) vault 루트 이름이 _site 안에 통째로 들어갔으면 실패 — 조립 실수의 전형.
[ ! -e "$OUT/$VAULT" ] || die "_site 안에 vault 디렉터리가 통째로 들어갔습니다: $OUT/$VAULT"

# (d) 발행 대상 수와 실제 복사된 수가 어긋나면 실패.
EXPECTED="$(node mirror.js --vault "$VAULT" --dry-run | grep -c . || true)"
ACTUAL="$(find "$OUT/blog" -type f -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')"
[ "$EXPECTED" = "$ACTUAL" ] \
  || die "발행 대상 수 불일치 — mirror.js: $EXPECTED, _site/blog: $ACTUAL"

rm -rf "$WORK"

echo
echo "빌드 완료: $OUT/ (발행 $ACTUAL 건)"
echo "로컬 확인:  npx serve $OUT"
