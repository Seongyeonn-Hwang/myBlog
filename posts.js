const POSTS = [
  {
    "date": "2026-03-11",
    "display": "2026년 3월 11일",
    "week": "latest",
    "path": "01. Daily notes/26年 03月 11日.md",
    "content": ""
  },
  {
    "date": "2026-03-10",
    "display": "2026년 3월 10일",
    "week": "latest",
    "path": "01. Daily notes/26年 03月 10日.md",
    "content": ""
  },
  {
    "date": "2026-03-04",
    "display": "2026년 3월 4일",
    "week": "latest",
    "path": "01. Daily notes/26年 03月 04日.md",
    "content": "---\ntype: daily\ndate: 26年 03月 04日\nday: 수요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n\n### Daily notes.\n- 오늘도 조금 늦게 일어났다, 약초 좀 캐다가 출근했고 부케 5개를 키워야 할 생각에 어질어질 하다. 재미는 있는데 문제는 시간이다.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n---\n```dataviewjs\ntry {  \n// ====== 설정 ======  \nconst DAILY_FOLDER = \"01. Daily notes\";  \nconst SECTION_HEADING = \"Daily notes.\";  \n// ==================  \n  \nfunction norm(s) {  \nreturn String(s ?? \"\")  \n.replace(/\\u3000/g, \" \")  \n.replace(/[\\u200B-\\u200D\\uFEFF]/g, \"\")  \n.trim();  \n}  \n  \nfunction parseYYMD(s) {  \nconst str = norm(s);  \nconst m = str.match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);  \nif (!m) return null;  \n  \nconst yy = 2000 + Number(m[1]);  \nconst mm = Number(m[2]);  \nconst dd = Number(m[3]);  \n  \nreturn dv.luxon.DateTime.local(yy, mm, dd).startOf(\"day\");  \n}  \n  \nfunction pageDate(p) {  \nreturn parseYYMD(p.date) || parseYYMD(p.file.name);  \n}  \n  \nasync function extractSectionText(p, headingText) {  \nconst full = await dv.io.load(p.file.path);  \nconst lines = full.split(\"\\n\");  \n  \nconst h = \"### \" + headingText;  \nlet start = lines.findIndex(l => norm(l) === h);  \nif (start === -1) return null;  \n  \nlet end = start + 1;  \nwhile (  \nend < lines.length &&  \n!/^#{1,6}\\s+/.test(norm(lines[end])) &&  \n!/^\\s*---\\s*$/.test(lines[end])  \n) end++;  \n  \nconst body = lines.slice(start + 1, end).join(\"\\n\").trim();  \nreturn body.length ? body : null;  \n}  \n  \nfunction renderBlock(title, content, fileLink) {  \ndv.header(4, title);  \nif (!content) {  \ndv.paragraph(\"- (내용 없음)\");  \nreturn;  \n}  \ndv.paragraph(`${fileLink}`);  \ndv.paragraph(content);  \n}  \n  \nconst today = pageDate(dv.current());  \nif (!today) {  \ndv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");  \nreturn;  \n}  \n  \nconst targets = [  \n{ label: \"일주일 전\", dt: today.minus({ days: 7 }).startOf(\"day\") },  \n{ label: \"한달 전\", dt: today.minus({ months: 1 }).startOf(\"day\") },  \n{ label: \"6개월 전\", dt: today.minus({ months: 6 }).startOf(\"day\") },  \n{ label: \"1년 전\", dt: today.minus({ years: 1 }).startOf(\"day\") },  \n];  \n  \nconst pagesDA = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");  \nconst pages = (pagesDA?.array ? pagesDA.array() : Array.from(pagesDA ?? []));  \n  \nconst map = new Map();  \nfor (const p of pages) {  \nconst d = pageDate(p);  \nif (!d) continue;  \nmap.set(d.toISODate(), p);  \n}  \n  \nfunction findPageByDate(dt) {  \nreturn map.get(dt.toISODate()) ?? null;  \n}  \n  \nlet first = true;  \n  \nfor (const t of targets) {  \nconst key = t.dt.toISODate();  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.paragraph(\"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(`- (해당 날짜 노트 없음) target=${key}`);  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(`${t.label} (${key})`, section, dv.fileLink(p.file.path));  \n}  \n  \n} catch (e) {  \ndv.paragraph(\"DataviewJS 실행 오류:\");  \ndv.paragraph(String(e?.message ?? e));  \n}\n```\n\n---\n"
  },
  {
    "date": "2026-03-03",
    "display": "2026년 3월 3일",
    "week": "latest",
    "path": "01. Daily notes/26年 03月 03日.md",
    "content": ""
  },
  {
    "date": "2026-03-03",
    "display": "2026년 3월 3일",
    "week": "W10",
    "path": "01. Daily notes/W10/26年 03月 03日.md",
    "content": "---\ntype: daily\ndate: 26年 03月 03日\nday: 화요일\ntags:\n  - dailyNote\nwakeup: 07:50\nsleep: 24:00\nweight:\n---\n\n\n### Daily notes.\n-  오늘은 좀 늦잠을 잤다, 회사생활이 너무 편해서 좋긴한데, 일이 너무 없는것 같아서 조금 걱정 되긴한다. 연말이 되면 또 성과를 평가해야하는 시즌이 오는데 시간은 왜 이렇게 빨리 갈까? 회사 생활하면서 꿀 빨순 없을까? (편하게 일하면서 진급까지 할 수 있는 방법)\n- 와우 새확장팩이 열려서 골드벌이를 제대로 해보려고 한다. 그러면 준비를 많이 해둬야 겠지...\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n---\n```dataviewjs\ntry {  \n// ====== 설정 ======  \nconst DAILY_FOLDER = \"01. Daily notes\";  \nconst SECTION_HEADING = \"Daily notes.\";  \n// ==================  \n  \nfunction norm(s) {  \nreturn String(s ?? \"\")  \n.replace(/\\u3000/g, \" \")  \n.replace(/[\\u200B-\\u200D\\uFEFF]/g, \"\")  \n.trim();  \n}  \n  \nfunction parseYYMD(s) {  \nconst str = norm(s);  \nconst m = str.match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);  \nif (!m) return null;  \n  \nconst yy = 2000 + Number(m[1]);  \nconst mm = Number(m[2]);  \nconst dd = Number(m[3]);  \n  \nreturn dv.luxon.DateTime.local(yy, mm, dd).startOf(\"day\");  \n}  \n  \nfunction pageDate(p) {  \nreturn parseYYMD(p.date) || parseYYMD(p.file.name);  \n}  \n  \nasync function extractSectionText(p, headingText) {  \nconst full = await dv.io.load(p.file.path);  \nconst lines = full.split(\"\\n\");  \n  \nconst h = \"### \" + headingText;  \nlet start = lines.findIndex(l => norm(l) === h);  \nif (start === -1) return null;  \n  \nlet end = start + 1;  \nwhile (  \nend < lines.length &&  \n!/^#{1,6}\\s+/.test(norm(lines[end])) &&  \n!/^\\s*---\\s*$/.test(lines[end])  \n) end++;  \n  \nconst body = lines.slice(start + 1, end).join(\"\\n\").trim();  \nreturn body.length ? body : null;  \n}  \n  \nfunction renderBlock(title, content, fileLink) {  \ndv.header(4, title);  \nif (!content) {  \ndv.paragraph(\"- (내용 없음)\");  \nreturn;  \n}  \ndv.paragraph(`${fileLink}`);  \ndv.paragraph(content);  \n}  \n  \nconst today = pageDate(dv.current());  \nif (!today) {  \ndv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");  \nreturn;  \n}  \n  \nconst targets = [  \n{ label: \"일주일 전\", dt: today.minus({ days: 7 }).startOf(\"day\") },  \n{ label: \"한달 전\", dt: today.minus({ months: 1 }).startOf(\"day\") },  \n{ label: \"6개월 전\", dt: today.minus({ months: 6 }).startOf(\"day\") },  \n{ label: \"1년 전\", dt: today.minus({ years: 1 }).startOf(\"day\") },  \n];  \n  \nconst pagesDA = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");  \nconst pages = (pagesDA?.array ? pagesDA.array() : Array.from(pagesDA ?? []));  \n  \nconst map = new Map();  \nfor (const p of pages) {  \nconst d = pageDate(p);  \nif (!d) continue;  \nmap.set(d.toISODate(), p);  \n}  \n  \nfunction findPageByDate(dt) {  \nreturn map.get(dt.toISODate()) ?? null;  \n}  \n  \nlet first = true;  \n  \nfor (const t of targets) {  \nconst key = t.dt.toISODate();  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.paragraph(\"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(`- (해당 날짜 노트 없음) target=${key}`);  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(`${t.label} (${key})`, section, dv.fileLink(p.file.path));  \n}  \n  \n} catch (e) {  \ndv.paragraph(\"DataviewJS 실행 오류:\");  \ndv.paragraph(String(e?.message ?? e));  \n}\n```\n\n---\n"
  },
  {
    "date": "2026-03-02",
    "display": "2026년 3월 2일",
    "week": "W10",
    "path": "01. Daily notes/W10/26年 03月 02日.md",
    "content": "---\ntype: daily\ndate: 26年 03月 02日\nday: 월요일\ntags:\n  - dailyNote\nwakeup: 07:30\nsleep: 24:00\nweight:\n---\n\n\n### Daily notes.\n- 오늘은 3월 2일 빨간날 와우를 실컷 했다, 만렙 두개 키우려고 했는데 지쳐서 그렇게 하지는 못했다. 이제 시작이니까 전문기술로 골드를 한번 벌어봐야겠다. 확장팩은 2년 정도하니깐 한번 꾸준히 해봐야지.\n\n\n\n\n\n\n\n---\n```dataviewjs\ntry {  \n// ====== 설정 ======  \nconst DAILY_FOLDER = \"01. Daily notes\";  \nconst SECTION_HEADING = \"Daily notes.\";  \n// ==================  \n  \nfunction norm(s) {  \nreturn String(s ?? \"\")  \n.replace(/\\u3000/g, \" \")  \n.replace(/[\\u200B-\\u200D\\uFEFF]/g, \"\")  \n.trim();  \n}  \n  \nfunction parseYYMD(s) {  \nconst str = norm(s);  \nconst m = str.match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);  \nif (!m) return null;  \n  \nconst yy = 2000 + Number(m[1]);  \nconst mm = Number(m[2]);  \nconst dd = Number(m[3]);  \n  \nreturn dv.luxon.DateTime.local(yy, mm, dd).startOf(\"day\");  \n}  \n  \nfunction pageDate(p) {  \nreturn parseYYMD(p.date) || parseYYMD(p.file.name);  \n}  \n  \nasync function extractSectionText(p, headingText) {  \nconst full = await dv.io.load(p.file.path);  \nconst lines = full.split(\"\\n\");  \n  \nconst h = \"### \" + headingText;  \nlet start = lines.findIndex(l => norm(l) === h);  \nif (start === -1) return null;  \n  \nlet end = start + 1;  \nwhile (  \nend < lines.length &&  \n!/^#{1,6}\\s+/.test(norm(lines[end])) &&  \n!/^\\s*---\\s*$/.test(lines[end])  \n) end++;  \n  \nconst body = lines.slice(start + 1, end).join(\"\\n\").trim();  \nreturn body.length ? body : null;  \n}  \n  \nfunction renderBlock(title, content, fileLink) {  \ndv.header(4, title);  \nif (!content) {  \ndv.paragraph(\"- (내용 없음)\");  \nreturn;  \n}  \ndv.paragraph(`${fileLink}`);  \ndv.paragraph(content);  \n}  \n  \nconst today = pageDate(dv.current());  \nif (!today) {  \ndv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");  \nreturn;  \n}  \n  \nconst targets = [  \n{ label: \"일주일 전\", dt: today.minus({ days: 7 }).startOf(\"day\") },  \n{ label: \"한달 전\", dt: today.minus({ months: 1 }).startOf(\"day\") },  \n{ label: \"6개월 전\", dt: today.minus({ months: 6 }).startOf(\"day\") },  \n{ label: \"1년 전\", dt: today.minus({ years: 1 }).startOf(\"day\") },  \n];  \n  \nconst pagesDA = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");  \nconst pages = (pagesDA?.array ? pagesDA.array() : Array.from(pagesDA ?? []));  \n  \nconst map = new Map();  \nfor (const p of pages) {  \nconst d = pageDate(p);  \nif (!d) continue;  \nmap.set(d.toISODate(), p);  \n}  \n  \nfunction findPageByDate(dt) {  \nreturn map.get(dt.toISODate()) ?? null;  \n}  \n  \nlet first = true;  \n  \nfor (const t of targets) {  \nconst key = t.dt.toISODate();  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.paragraph(\"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(`- (해당 날짜 노트 없음) target=${key}`);  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(`${t.label} (${key})`, section, dv.fileLink(p.file.path));  \n}  \n  \n} catch (e) {  \ndv.paragraph(\"DataviewJS 실행 오류:\");  \ndv.paragraph(String(e?.message ?? e));  \n}\n```\n\n---\n"
  },
  {
    "date": "2026-03-01",
    "display": "2026년 3월 1일",
    "week": "W10",
    "path": "01. Daily notes/W10/26年 03月 01日.md",
    "content": "---\ntype: daily\ndate: 26年 03月 01日\nday: 일요일\ntags:\n  - dailyNote\nwakeup: 08:00\nsleep: 23:30\nweight:\n---\n\n\n### Daily notes.\n- 3월 1일이 되었다, 와우 하려고 풀 배열 키보드를 꺼냈다. 키보드가 한결 더 시끄러워 졌다.\n- 재범이 청접장 모임을 했다, 나랑 지눅스랑 재범이랑 만났고 가볍게 밥 먹고 보드게임 했다. 바퀴벌레 포커는 재미있었다.\n- 옵시디언 CLI가 생겼다 뭐하는 건지 한번 봐야징~\n- \n\n\n\n---\n```dataviewjs\ntry {  \n// ====== 설정 ======  \nconst DAILY_FOLDER = \"01. Daily notes\";  \nconst SECTION_HEADING = \"Daily notes.\";  \n// ==================  \n  \nfunction norm(s) {  \nreturn String(s ?? \"\")  \n.replace(/\\u3000/g, \" \")  \n.replace(/[\\u200B-\\u200D\\uFEFF]/g, \"\")  \n.trim();  \n}  \n  \nfunction parseYYMD(s) {  \nconst str = norm(s);  \nconst m = str.match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);  \nif (!m) return null;  \n  \nconst yy = 2000 + Number(m[1]);  \nconst mm = Number(m[2]);  \nconst dd = Number(m[3]);  \n  \nreturn dv.luxon.DateTime.local(yy, mm, dd).startOf(\"day\");  \n}  \n  \nfunction pageDate(p) {  \nreturn parseYYMD(p.date) || parseYYMD(p.file.name);  \n}  \n  \nasync function extractSectionText(p, headingText) {  \nconst full = await dv.io.load(p.file.path);  \nconst lines = full.split(\"\\n\");  \n  \nconst h = \"### \" + headingText;  \nlet start = lines.findIndex(l => norm(l) === h);  \nif (start === -1) return null;  \n  \nlet end = start + 1;  \nwhile (  \nend < lines.length &&  \n!/^#{1,6}\\s+/.test(norm(lines[end])) &&  \n!/^\\s*---\\s*$/.test(lines[end])  \n) end++;  \n  \nconst body = lines.slice(start + 1, end).join(\"\\n\").trim();  \nreturn body.length ? body : null;  \n}  \n  \nfunction renderBlock(title, content, fileLink) {  \ndv.header(4, title);  \nif (!content) {  \ndv.paragraph(\"- (내용 없음)\");  \nreturn;  \n}  \ndv.paragraph(`${fileLink}`);  \ndv.paragraph(content);  \n}  \n  \nconst today = pageDate(dv.current());  \nif (!today) {  \ndv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");  \nreturn;  \n}  \n  \nconst targets = [  \n{ label: \"일주일 전\", dt: today.minus({ days: 7 }).startOf(\"day\") },  \n{ label: \"한달 전\", dt: today.minus({ months: 1 }).startOf(\"day\") },  \n{ label: \"6개월 전\", dt: today.minus({ months: 6 }).startOf(\"day\") },  \n{ label: \"1년 전\", dt: today.minus({ years: 1 }).startOf(\"day\") },  \n];  \n  \nconst pagesDA = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");  \nconst pages = (pagesDA?.array ? pagesDA.array() : Array.from(pagesDA ?? []));  \n  \nconst map = new Map();  \nfor (const p of pages) {  \nconst d = pageDate(p);  \nif (!d) continue;  \nmap.set(d.toISODate(), p);  \n}  \n  \nfunction findPageByDate(dt) {  \nreturn map.get(dt.toISODate()) ?? null;  \n}  \n  \nlet first = true;  \n  \nfor (const t of targets) {  \nconst key = t.dt.toISODate();  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.paragraph(\"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(`- (해당 날짜 노트 없음) target=${key}`);  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(`${t.label} (${key})`, section, dv.fileLink(p.file.path));  \n}  \n  \n} catch (e) {  \ndv.paragraph(\"DataviewJS 실행 오류:\");  \ndv.paragraph(String(e?.message ?? e));  \n}\n```\n\n---\n\n\n\n\n\n"
  },
  {
    "date": "2026-02-28",
    "display": "2026년 2월 28일",
    "week": "W9",
    "path": "01. Daily notes/W9/26年 02月 28日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 28日\nday: 토요일\ntags:\n  - dailyNote\nwakeup: 07:30\nsleep: 23:20\nweight: 81.5\n---\n\n\n### Daily notes.\n- 오늘 아침부터 일어나서 혜와 탁구를 쳤다, 점점 실력이 올라가는 거 같아서 여운이 좀 남는다.\n- 와우 한밤이 오픈해서 레벨업 좀 하려는데 피곤함 앞에 장사가 없네, 게임이 재미 없는 건지 내가 체력이 없는 건지.\n- 내일은 재범이 청첩장 모임을 한다고 했다 굳이 이렇게 까지 할 필요가 없는데 까빙.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n---\n```dataviewjs\n// ====== 설정 ======\nconst DAILY_FOLDER = \"01. Daily notes\"; // 일지 폴더 경로(필요 없으면 \"\"로 두고 아래 page query만 수정)\nconst SECTION_HEADING = \"Daily notes.\"; // \"### Daily notes.\" 에서 ### 제외한 텍스트\n// ==================\n\nfunction parseYYMD(s) {\n  // \"26年 02月 22日\" 또는 \"26年02月22日\"\n  const m = String(s ?? \"\").match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);\n  if (!m) return null;\n  const yy = 2000 + Number(m[1]);\n  const mm = Number(m[2]);\n  const dd = Number(m[3]);\n  return dv.luxon.DateTime.fromObject({ year: yy, month: mm, day: dd });\n}\n\nfunction pageDate(p) {\n  // frontmatter date 우선, 없으면 파일명에서 파싱\n  return parseYYMD(p.date) || parseYYMD(p.file.name);\n}\n\nasync function extractSectionText(p, headingText) {\n  // 파일 전체 텍스트를 읽고, \"### headingText\" 섹션만 잘라냄\n  const full = await dv.io.load(p.file.path);\n  const lines = full.split(\"\\n\");\n\n  const h = \"### \" + headingText;\n  let start = lines.findIndex(l => l.trim() === h);\n  if (start === -1) return null;\n\n  // 다음 같은 레벨 이상의 헤딩(###, ##, #) 나오기 전까지가 섹션\n  let end = start + 1;\n  while (end < lines.length) {\n    const t = lines[end].trim();\n    if (/^#{1,3}\\s+/.test(t) && t.startsWith(\"### \") && t !== h) break; // 다음 ### 헤딩\n    if (/^#{1,2}\\s+/.test(t)) break; // 상위 헤딩 나오면 종료\n    end++;\n  }\n\n  // 섹션 본문(헤딩 줄 제외)\n  const body = lines.slice(start + 1, end).join(\"\\n\").trim();\n  return body.length ? body : null;\n}\n\nfunction renderBlock(title, dateObj, content, fileLink) {\n  dv.header(4, title);\n  if (!dateObj || !content) {\n    dv.paragraph(\"- (내용 없음)\");\n    return;\n  }\n  dv.paragraph(`${fileLink}`); //   \\n${dateObj.toFormat(\"yyyy-LL-dd\")}\n  dv.paragraph(content);\n}\n\n// 오늘 페이지 기준 날짜\nconst today = pageDate(dv.current());\nif (!today) {\n  dv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");\n  return;\n}\n\n// 대상 날짜 계산\nconst targets = [\n  { label: \"일주일 전\", dt: today.minus({ days: 7 }) },\n  { label: \"한달 전\", dt: today.minus({ months: 1 }) },\n  { label: \"6개월 전\", dt: today.minus({ months: 6 }) },\n  { label: \"1년 전\",   dt: today.minus({ years: 1 }) },\n];\n\n// 일지 페이지 후보 목록\nconst pages = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");\n\n// 날짜로 페이지 찾기\nfunction findPageByDate(dt) {\n  return pages.where(p => {\n    const d = pageDate(p);\n    return d && d.hasSame(dt, \"day\");\n  }).first();\n}\n\ndv.header(3, \"\");\n\nlet first = true;  \n  \nfor (const t of targets) {  \n  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.header(1, \"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(\"- (해당 날짜 노트 없음)\");  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(t.label, t.dt, section, dv.fileLink(p.file.path));  \n}\n```\n\n---"
  },
  {
    "date": "2026-02-25",
    "display": "2026년 2월 25일",
    "week": "W9",
    "path": "01. Daily notes/W9/26年 02月 25日.md",
    "content": ""
  },
  {
    "date": "2026-02-24",
    "display": "2026년 2월 24일",
    "week": "W9",
    "path": "01. Daily notes/W9/26年 02月 24日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 24日\nday: 화요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n\n### Daily notes.\n- \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n---\n```dataviewjs\n// ====== 설정 ======\nconst DAILY_FOLDER = \"01. Daily notes\"; // 일지 폴더 경로(필요 없으면 \"\"로 두고 아래 page query만 수정)\nconst SECTION_HEADING = \"Daily notes.\"; // \"### Daily notes.\" 에서 ### 제외한 텍스트\n// ==================\n\nfunction parseYYMD(s) {\n  // \"26年 02月 22日\" 또는 \"26年02月22日\"\n  const m = String(s ?? \"\").match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);\n  if (!m) return null;\n  const yy = 2000 + Number(m[1]);\n  const mm = Number(m[2]);\n  const dd = Number(m[3]);\n  return dv.luxon.DateTime.fromObject({ year: yy, month: mm, day: dd });\n}\n\nfunction pageDate(p) {\n  // frontmatter date 우선, 없으면 파일명에서 파싱\n  return parseYYMD(p.date) || parseYYMD(p.file.name);\n}\n\nasync function extractSectionText(p, headingText) {\n  // 파일 전체 텍스트를 읽고, \"### headingText\" 섹션만 잘라냄\n  const full = await dv.io.load(p.file.path);\n  const lines = full.split(\"\\n\");\n\n  const h = \"### \" + headingText;\n  let start = lines.findIndex(l => l.trim() === h);\n  if (start === -1) return null;\n\n  // 다음 같은 레벨 이상의 헤딩(###, ##, #) 나오기 전까지가 섹션\n  let end = start + 1;\n  while (end < lines.length) {\n    const t = lines[end].trim();\n    if (/^#{1,3}\\s+/.test(t) && t.startsWith(\"### \") && t !== h) break; // 다음 ### 헤딩\n    if (/^#{1,2}\\s+/.test(t)) break; // 상위 헤딩 나오면 종료\n    end++;\n  }\n\n  // 섹션 본문(헤딩 줄 제외)\n  const body = lines.slice(start + 1, end).join(\"\\n\").trim();\n  return body.length ? body : null;\n}\n\nfunction renderBlock(title, dateObj, content, fileLink) {\n  dv.header(4, title);\n  if (!dateObj || !content) {\n    dv.paragraph(\"- (내용 없음)\");\n    return;\n  }\n  dv.paragraph(`${fileLink}`); //   \\n${dateObj.toFormat(\"yyyy-LL-dd\")}\n  dv.paragraph(content);\n}\n\n// 오늘 페이지 기준 날짜\nconst today = pageDate(dv.current());\nif (!today) {\n  dv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");\n  return;\n}\n\n// 대상 날짜 계산\nconst targets = [\n  { label: \"일주일 전\", dt: today.minus({ days: 7 }) },\n  { label: \"한달 전\", dt: today.minus({ months: 1 }) },\n  { label: \"6개월 전\", dt: today.minus({ months: 6 }) },\n  { label: \"1년 전\",   dt: today.minus({ years: 1 }) },\n];\n\n// 일지 페이지 후보 목록\nconst pages = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");\n\n// 날짜로 페이지 찾기\nfunction findPageByDate(dt) {\n  return pages.where(p => {\n    const d = pageDate(p);\n    return d && d.hasSame(dt, \"day\");\n  }).first();\n}\n\ndv.header(3, \"\");\n\nlet first = true;  \n  \nfor (const t of targets) {  \n  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.header(1, \"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(\"- (해당 날짜 노트 없음)\");  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(t.label, t.dt, section, dv.fileLink(p.file.path));  \n}\n```\n\n---"
  },
  {
    "date": "2026-02-23",
    "display": "2026년 2월 23일",
    "week": "W9",
    "path": "01. Daily notes/W9/26年 02月 23日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 23日\nday: 월요일\ntags:\n  - dailyNote\nwakeup: 07:30\nsleep: 23:30\nweight:\n---\n\n\n### Daily notes.\n- ISA는 만기 시점에 과세된다.\n- 연 2000, 총 1억까지 (매매 차익에 대해 200만원 까지는 세금 면제, 추가로 9.9% 세율이 적용된다.\n- 원금\n\t- 2026년 2000만원\n\t- 2027년 4000만원\n\t- 2028년 6000만원\n\t- 2029년 2월 23일 만기 해지\n- 총 수익은 많으면 많을수록 좋음 (일반 계좌로 매매 차익에 대한 세금 면제는 250만원)\n\n- 개인연금\n\t- 개인연금은 연 600만원 소득 공제가 된다.\n\t- 월급의 3% 납입하면 (약 16만원) 회사에서 3% 지원해줌 (약 총 32만원)\n\t- 그러면 12개월 했을때 약 384만원, 216만원 더 소득 공제 가능\n\t- 12월 중순 연말정산 전 까지, 216만원을 추가로 연금 계좌로 옮기면 600만원 소득공제 가능\n\n- 아침은 과일, 커피, 홍삼액, 두유\n- 점심은 김밥에 샐러드\n- 저녁은 김치찌개, 간장계란장, 오징어젓갈, 김\n\n\n\n\n\n\n\n\n\n\n\n\n\n---\n```dataviewjs\n// ====== 설정 ======\nconst DAILY_FOLDER = \"01. Daily notes\"; // 일지 폴더 경로(필요 없으면 \"\"로 두고 아래 page query만 수정)\nconst SECTION_HEADING = \"Daily notes.\"; // \"### Daily notes.\" 에서 ### 제외한 텍스트\n// ==================\n\nfunction parseYYMD(s) {\n  // \"26年 02月 22日\" 또는 \"26年02月22日\"\n  const m = String(s ?? \"\").match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);\n  if (!m) return null;\n  const yy = 2000 + Number(m[1]);\n  const mm = Number(m[2]);\n  const dd = Number(m[3]);\n  return dv.luxon.DateTime.fromObject({ year: yy, month: mm, day: dd });\n}\n\nfunction pageDate(p) {\n  // frontmatter date 우선, 없으면 파일명에서 파싱\n  return parseYYMD(p.date) || parseYYMD(p.file.name);\n}\n\nasync function extractSectionText(p, headingText) {\n  // 파일 전체 텍스트를 읽고, \"### headingText\" 섹션만 잘라냄\n  const full = await dv.io.load(p.file.path);\n  const lines = full.split(\"\\n\");\n\n  const h = \"### \" + headingText;\n  let start = lines.findIndex(l => l.trim() === h);\n  if (start === -1) return null;\n\n  // 다음 같은 레벨 이상의 헤딩(###, ##, #) 나오기 전까지가 섹션\n  let end = start + 1;\n  while (end < lines.length) {\n    const t = lines[end].trim();\n    if (/^#{1,3}\\s+/.test(t) && t.startsWith(\"### \") && t !== h) break; // 다음 ### 헤딩\n    if (/^#{1,2}\\s+/.test(t)) break; // 상위 헤딩 나오면 종료\n    end++;\n  }\n\n  // 섹션 본문(헤딩 줄 제외)\n  const body = lines.slice(start + 1, end).join(\"\\n\").trim();\n  return body.length ? body : null;\n}\n\nfunction renderBlock(title, dateObj, content, fileLink) {\n  dv.header(4, title);\n  if (!dateObj || !content) {\n    dv.paragraph(\"- (내용 없음)\");\n    return;\n  }\n  dv.paragraph(`${fileLink}`); //   \\n${dateObj.toFormat(\"yyyy-LL-dd\")}\n  dv.paragraph(content);\n}\n\n// 오늘 페이지 기준 날짜\nconst today = pageDate(dv.current());\nif (!today) {\n  dv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");\n  return;\n}\n\n// 대상 날짜 계산\nconst targets = [\n  { label: \"일주일 전\", dt: today.minus({ days: 7 }) },\n  { label: \"한달 전\", dt: today.minus({ months: 1 }) },\n  { label: \"6개월 전\", dt: today.minus({ months: 6 }) },\n  { label: \"1년 전\",   dt: today.minus({ years: 1 }) },\n];\n\n// 일지 페이지 후보 목록\nconst pages = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");\n\n// 날짜로 페이지 찾기\nfunction findPageByDate(dt) {\n  return pages.where(p => {\n    const d = pageDate(p);\n    return d && d.hasSame(dt, \"day\");\n  }).first();\n}\n\ndv.header(3, \"\");\n\nlet first = true;  \n  \nfor (const t of targets) {  \n  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.header(1, \"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(\"- (해당 날짜 노트 없음)\");  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(t.label, t.dt, section, dv.fileLink(p.file.path));  \n}\n```\n\n---"
  },
  {
    "date": "2026-02-22",
    "display": "2026년 2월 22일",
    "week": "W9",
    "path": "01. Daily notes/W9/26年 02月 22日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 22日\nday: 일요일\ntags:\n  - dailyNote\nwakeup: 09:30\nsleep: 24:30\nweight:\n---\n\n### Daily notes.\n- [간장계란장](Recipe-간장계란장.md)와 비빔밥, 그리고 저녁에는 파슬리 파스타 해먹었는데, 맛이 별로 였어서 맛있는 레시피를 만들면 정리 해봐야 겠다.\n- 아침에 일어나서 집 근처 무인 탁구장에 가서 탁구를 쳤다, 일주일에 한번씩은 어떤 방식으로라도 신체 활동을 함께 했으면 좋겠다는 제안이 있었기 때문이다. 나도 그점은 동의한다. 재미있는 신체 활동으로 살도 빼고 체력도 좋아진다면 얼마나 좋을까, 지금 아이디어는 탁구, 배드민턴 정도이다. 일단 아침 7시에 일어나서 가기로 했는데 10시에 일어났다. 후.. 다음 주에는 경기 공유 서비스 통해서 탁구장을 예약했다, 8시 부터 10시 까지 과연 우리는 무사히 탁구를 칠 수 있을까.\n- ISA계좌 3년 지속, 연 최대 2000만원 (3년 6000만원), 연 200만원 수익금에 대한 세금(15.7%) 면제, 추가 수익금에 대한 세금 절세(9.9%) + 공통으로 250만원 수익에 대한 세금 면제.\n- 국내 주식은 수익에 대한 세금은 없으나, Tiger 미국 S&P 500 같은 해외지수추종 ETF는 세금이 발생 됨\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n---\n```dataviewjs\n// ====== 설정 ======\nconst DAILY_FOLDER = \"01. Daily notes\"; // 일지 폴더 경로(필요 없으면 \"\"로 두고 아래 page query만 수정)\nconst SECTION_HEADING = \"Daily notes.\"; // \"### Daily notes.\" 에서 ### 제외한 텍스트\n// ==================\n\nfunction parseYYMD(s) {\n  // \"26年 02月 22日\" 또는 \"26年02月22日\"\n  const m = String(s ?? \"\").match(/(\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日/);\n  if (!m) return null;\n  const yy = 2000 + Number(m[1]);\n  const mm = Number(m[2]);\n  const dd = Number(m[3]);\n  return dv.luxon.DateTime.fromObject({ year: yy, month: mm, day: dd });\n}\n\nfunction pageDate(p) {\n  // frontmatter date 우선, 없으면 파일명에서 파싱\n  return parseYYMD(p.date) || parseYYMD(p.file.name);\n}\n\nasync function extractSectionText(p, headingText) {\n  // 파일 전체 텍스트를 읽고, \"### headingText\" 섹션만 잘라냄\n  const full = await dv.io.load(p.file.path);\n  const lines = full.split(\"\\n\");\n\n  const h = \"### \" + headingText;\n  let start = lines.findIndex(l => l.trim() === h);\n  if (start === -1) return null;\n\n  // 다음 같은 레벨 이상의 헤딩(###, ##, #) 나오기 전까지가 섹션\n  let end = start + 1;\n  while (end < lines.length) {\n    const t = lines[end].trim();\n    if (/^#{1,3}\\s+/.test(t) && t.startsWith(\"### \") && t !== h) break; // 다음 ### 헤딩\n    if (/^#{1,2}\\s+/.test(t)) break; // 상위 헤딩 나오면 종료\n    end++;\n  }\n\n  // 섹션 본문(헤딩 줄 제외)\n  const body = lines.slice(start + 1, end).join(\"\\n\").trim();\n  return body.length ? body : null;\n}\n\nfunction renderBlock(title, dateObj, content, fileLink) {\n  dv.header(4, title);\n  if (!dateObj || !content) {\n    dv.paragraph(\"- (내용 없음)\");\n    return;\n  }\n  dv.paragraph(`${fileLink}`); //   \\n${dateObj.toFormat(\"yyyy-LL-dd\")}\n  dv.paragraph(content);\n}\n\n// 오늘 페이지 기준 날짜\nconst today = pageDate(dv.current());\nif (!today) {\n  dv.paragraph(\"현재 노트의 date(YY年 MM月 DD日) 또는 파일명에서 날짜를 파싱하지 못했습니다.\");\n  return;\n}\n\n// 대상 날짜 계산\nconst targets = [\n  { label: \"일주일 전\", dt: today.minus({ days: 7 }) },\n  { label: \"한달 전\", dt: today.minus({ months: 1 }) },\n  { label: \"6개월 전\", dt: today.minus({ months: 6 }) },\n  { label: \"1년 전\",   dt: today.minus({ years: 1 }) },\n];\n\n// 일지 페이지 후보 목록\nconst pages = dv.pages(DAILY_FOLDER ? `\"${DAILY_FOLDER}\"` : \"\");\n\n// 날짜로 페이지 찾기\nfunction findPageByDate(dt) {\n  return pages.where(p => {\n    const d = pageDate(p);\n    return d && d.hasSame(dt, \"day\");\n  }).first();\n}\n\ndv.header(3, \"\");\n\nlet first = true;  \n  \nfor (const t of targets) {  \n  \nconst p = findPageByDate(t.dt);  \n  \nif (!first) dv.header(1, \"---\");  \nfirst = false;  \n  \nif (!p) {  \ndv.header(4, t.label);  \ndv.paragraph(\"- (해당 날짜 노트 없음)\");  \ncontinue;  \n}  \n  \nconst section = await extractSectionText(p, SECTION_HEADING);  \nrenderBlock(t.label, t.dt, section, dv.fileLink(p.file.path));  \n}\n```\n\n---"
  },
  {
    "date": "2026-02-21",
    "display": "2026년 2월 21일",
    "week": "W8",
    "path": "01. Daily notes/W8/26年 02月 21日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 21日\nday: 토요일\ntags:\n  - dailyNote\nwakeup: 08:00\nsleep: 24:30\nweight: 79.80\n---\n\n### Daily notes.\n- 디아블로와 와우 다시 한번 블리자드 게임을 하게 되었네?\n- 오늘은 세차하고 수원 롯데몰 가서 밥 먹고 무지에 갔다가 집에 왔어\n- 엄청나게 긴 추석 연휴도 끝나가는구먼.. 내일이 벌써 마지막 날이야\n- 하루하루 즐겁게 사는것도 중요하지만, 미래를 위해 시간을 투자 하는 것도 중요하다.\n- 장기적 으로 즐거움을 주면서 나에게 도움이 될 수 있는건 뭘까?\n- \n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-20",
    "display": "2026년 2월 20일",
    "week": "W8",
    "path": "01. Daily notes/W8/26年 02月 20日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 20日\nday: 금요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n### Daily notes.\n- 시간 여행 주화\n\n### Plan\n- [ ] 세차\n- [ ] 옷 정리\n- [ ] 디아블로\n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-19",
    "display": "2026년 2월 19일",
    "week": "W8",
    "path": "01. Daily notes/W8/26年 02月 19日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 19日\nday: 목요일\ntags:\n  - dailyNote\nwakeup: 07:00\nsleep: 23:30\nweight: 79.80\n---\n\n### Daily notes.\n-  드디어 명절이 끝났다, 시간이 너무 빨리가서 좀 아쉬웠다, 그래도 일년에 몇번 못보는 가족들인데, 시간을 의미 있게 보낼 수 있도록 노력해야겠다.\n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-12",
    "display": "2026년 2월 12일",
    "week": "W7",
    "path": "01. Daily notes/W7/26年 02月 12日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 12日\nday: 목요일\ntags:\n  - dailyNote\nwakeup: 08:30\nsleep: 24:00\nweight:\n---\n\n### Daily notes.\n- 아 개 치명적인 실수를 했다, 5년 다이어리를 호텔에 놓고 왔다. 일단 호텔에 보관을 좀 해달라고 하고 그 다음에 나중에 이집트에 오면 돌려 달라고 해야지 이런 씝 ㅠㅠ\n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-08",
    "display": "2026년 2월 8일",
    "week": "W7",
    "path": "01. Daily notes/W7/26年 02月 08日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 08日\nday: 일요일\ntags:\n  - dailyNote\nwakeup: 06:07\nsleep:\nweight:\n---\n\n### Daily notes.\n- \n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-07",
    "display": "2026년 2월 7일",
    "week": "W6",
    "path": "01. Daily notes/W6/26年 02月 07日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 07日\nday: 토요일\ntags:\n  - dailyNote\nwakeup: 05:40\nsleep: 23:30\nweight:\n---\n\n### Daily notes.\n- \n\n### Plan\n- [ ] \n\n### Tracking.\n- [x] Wake up early\n- [x] Go to bed early\n- [x] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-06",
    "display": "2026년 2월 6일",
    "week": "W6",
    "path": "01. Daily notes/W6/26年 02月 06日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 06日\nday: 금요일\ntags:\n  - dailyNote\nwakeup: 08:00\nsleep: 20:50\nweight:\n---\n\n### Daily notes.\n- 아주 좋은 아이디어를 떠올렸다, 모든게 다 있는 게임을 만들면 어떨까?\n\n### Plan\n- [ ] \n\n### Tracking.\n- [x] Wake up early\n- [x] Go to bed early\n- [x] Study english\n- [ ] Read\n- [x] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-05",
    "display": "2026년 2월 5일",
    "week": "W6",
    "path": "01. Daily notes/W6/26年 02月 05日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 05日\nday: 목요일\ntags:\n  - dailyNote\nwakeup: 5:40\nsleep:\nweight:\n---\n\n### Daily notes.\n- \n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-02-01",
    "display": "2026년 2월 1일",
    "week": "W6",
    "path": "01. Daily notes/W6/26年 02月 01日.md",
    "content": "---\ntype: daily\ndate: 26年 02月 01日\nday: 일요일\ntags:\n  - dailyNote\nwakeup: 05:40\nsleep: 23:20\nweight: 82.1\n---\n\n### Daily notes.\n- 망할 출장 때문에 나의 미라클모닝이 무너졌다, 대신 지금은 강제 미라클 모닝을 하고 있다. 빌어먹을 언른 집에 가고 싶어..\n- 정말 미칠듯한 똥돼지가 되어가고 있는것 같다. 몸무게가 끝도 없이 불어나고 있다.\n\n### Plan\n- [ ] \n\n### Tracking.\n- [x] Wake up early\n- [x] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [x] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-28",
    "display": "2026년 1월 28일",
    "week": "W5",
    "path": "01. Daily notes/W5/26年 01月 28日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 28日\nday: 수요일\ntags:\n  - dailyNote\nwakeup: 05:00\nsleep:\nweight:\n---\n\n### Daily notes.\n- 시차 때문에 잠을 설쳤다. 1시에 일어나서 화장실을 갔음..\n\n- \n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-27",
    "display": "2026년 1월 27일",
    "week": "W5",
    "path": "01. Daily notes/W5/26年 01月 27日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 27日\nday: 화요일\ntags:\n  - dailyNote\nwakeup: 00:00\nsleep: \nweight:\n---\n\n### Daily notes.\n- \n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-26",
    "display": "2026년 1월 26일",
    "week": "W5",
    "path": "01. Daily notes/W5/26年 01月 26日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 26日\nday: 월요일\ntags:\n  - dailyNote\nwakeup: 07:30\nsleep: 24:00\nweight: 81.20\n---\n\n### Daily notes.\n- 이집트로 출발하는 날 너무 빡세다\n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-25",
    "display": "2026년 1월 25일",
    "week": "W4",
    "path": "01. Daily notes/W4/26年 01月 25日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 25日\nday: 일요일\ntags:\n  - dailyNote\nwakeup: 08:00\nsleep: 24:30\nweight: 81.00\n---\n\n### Daily notes.\n-  드디어 두쫀쿠를 먹어봤다! \n\n### Plan\n- [ ] 줄 이어폰\n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-23",
    "display": "2026년 1월 23일",
    "week": "W4",
    "path": "01. Daily notes/W4/26年 01月 23日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 23日\nday: 금요일\ntags:\n  - dailyNote\nwakeup: 07:20\nsleep: 24:20\nweight: 81.20\n---\n\n### Daily notes.\n- \n\n### Plan\n- [ ] \n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-22",
    "display": "2026년 1월 22일",
    "week": "W4",
    "path": "01. Daily notes/W4/26年 01月 22日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 22日\nday: 목요일\ntags:\n  - dailyNote\nwakeup: 07:20\nsleep: \nweight: 81.20\n---\n\n### Daily notes.\n-  능력을 키워야 한다, 사람은 능력이 있어야 먹고 살 수 있다.\n\n### Plan\n- [x] 노트북 반출증\n- [x] 품의 결재\n- [ ] 라운지 문의\n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [x] Read\n- [x] Fasting after 21 PM\n- [x] Sauna\n- [ ] Workout\n\n"
  },
  {
    "date": "2026-01-21",
    "display": "2026년 1월 21일",
    "week": "W4",
    "path": "01. Daily notes/W4/26年 01月 21日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 21日\nday: 수요일\ntags:\n  - dailyNote\nwakeup: 07:20\nsleep: 23:40\nweight:\n---\n\n### Daily notes.\n- 출근이 너무 늦다, 이래선 안된다! 정신 차려\n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n###"
  },
  {
    "date": "2026-01-20",
    "display": "2026년 1월 20일",
    "week": "W4",
    "path": "01. Daily notes/W4/26年 01月 20日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 20日\nday: 화요일\ntags:\n  - dailyNote\nwakeup: 07:25\nsleep: 23:50\nweight:\n---\n\n### Daily notes.\n- 회식 했다, 갈비 너무 달고 불이 약했다.\n- 회식에 5명이나 참가를 안했는데, 갈비 먹었다고 회식비를 거의 다 썻다, 회식비가 올랐으면 좋겠다.\n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n\n### Plan.\n - [ ] 06:30 기상\n - [ ] 07:30 출근\n - [x] 출장 품의\n - [x] RMCS 프로그램 비교 #1순위 \n- [x] 가동종료 자동화 컨플 #1순위\n- [ ] 승격지원 #금요일\n - [x] 회식 리마인드 105만원\n - [x] 파트원 조사\n - [x] 현장 자재 정리/분리"
  },
  {
    "date": "2026-01-19",
    "display": "2026년 1월 19일",
    "week": "W4",
    "path": "01. Daily notes/W4/26年 01月 19日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 19日\nday: 월요일\ntags:\n  - dailyNote\nwakeup: 06:50\nsleep: 24:10\nweight: 81.2\n---\n\n### Daily notes.\n- 초심을 잃지 말자, 게으름 피우지 말자, 멍때리는건 이제 그만\n- 해야 할 일들을 정리하고 실천하자. 시간은 끊임없이 간다, 기록하고 돌아보자.\n\n### Tracking.\n- [x] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [x] Sauna\n- [ ] Workout\n"
  },
  {
    "date": "2026-01-16",
    "display": "2026년 1월 16일",
    "week": "W3",
    "path": "01. Daily notes/W3/26年 01月 16日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 16日\nday: 금요일\ntags:\n  - dailyNote\nwakeup: 07:25\nsleep: 23:55\nweight:\n---\n\n### Daily notes.\n- 마음을 다시 잡고, 하루의 루틴을 천천히 다듬어서 만들어보자.\n1. 출근은 무조건 일찍 할 것\n\t- 정말 아침에 일어나는게 아니면 모닝 보단 저녁 운동 사우나\n2. 책읽기, 영어 공부는 요일별로 분류를 하면 어떨까?\n\n\n### Tracking\n- [ ] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [x] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n"
  },
  {
    "date": "2026-01-15",
    "display": "2026년 1월 15일",
    "week": "W3",
    "path": "01. Daily notes/W3/26年 01月 15日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 15日\nday: 목요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight: 80.8\n---\n\n### Daily notes.\n- 자존심 상해 하지 말자, 내가 잘못한거다.\n\n\n### Tracking\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [x] Fasting after 21 PM\n- [x] Sauna\n- [ ] Workout\n- weight :  80.80"
  },
  {
    "date": "2026-01-13",
    "display": "2026년 1월 13일",
    "week": "W3",
    "path": "01. Daily notes/W3/26年 01月 13日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 19日\nday: 월요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n### Daily notes.\n- 구글 계정 삭제\n- 공유 캘린더 만들기\n\n### Tracking\n- [x] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [ ] Read\n- [x] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n- weight : \n\n\n"
  },
  {
    "date": "2026-01-10",
    "display": "2026년 1월 10일",
    "week": "W2",
    "path": "01. Daily notes/W2/26年 01月 10日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 10日\nday: 토요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n### Daily Notes.\n- 주말 이라고 게을렀다, 빈티지 가구 구경을 갔다가 스타필드 하남에 가서 이것 저것 구경 했다.\n- 적절한 식탁을 언제 쯤 찾을 수 있을지 궁금하다.\n- 오늘 또 마음가짐을 한다, 내일 부터는 아침 일찍 일어나 운동 하리라...!\n\n### Tracking\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n- weight : 80.40\n\n### Tomorrow Plan\n - ~ 06:30 기상, 환복, 빨래 돌리기\n - ~ 07:30 모닝 뜀박질 (5km)\n - ~ 08:30 사우나"
  },
  {
    "date": "2026-01-09",
    "display": "2026년 1월 9일",
    "week": "W2",
    "path": "01. Daily notes/W2/26年 01月 09日.md",
    "content": "### Daliy notes.\n- 와, 이런 잠을 진짜 많이 잤다, 갓생을 살기로 하고 늦잠을 자 버려 버렸다.\n- 정신 차려야 겠다,,,\n\n\n\n### Tracking\n- [ ] Wake up early\n- [x] Go to bed early\n- [x] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n- weight : "
  },
  {
    "date": "2026-01-08",
    "display": "2026년 1월 8일",
    "week": "W2",
    "path": "01. Daily notes/W2/26年 01月 08日.md",
    "content": "### Daliy notes.\n- 별 일 없는 하루, 아침에 일찍 일어나서 [[러닝]]을 했고 집에서 샤워하고 출근하니 오전 9시, 이 출근 시간을 앞당기고 싶다.\n- 곤도 마리에, 설레지 않으면 버려라 읽을수록 뭔가 사짜 느낌이 난다.\n- 32인치 모니터가 아주 굿이다.\n- 2차 발더게 원정대 진행 20:30 ~ 22:30\n\n### Tracking\n- [x] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [x] [[세컨드 브레인 부스트]]\n- [x] Fasting after 21 PM\n- [x] Sauna\n- [x] Workout\n- weight :  79.95"
  },
  {
    "date": "2026-01-07",
    "display": "2026년 1월 7일",
    "week": "W2",
    "path": "01. Daily notes/W2/26年 01月 07日.md",
    "content": "### Daliy notes.\n- 이집트 출장 가야한다 씝, 젠장\n\n\n\n### Tracking\n- [x] Wake up early\n- [ ] Go to bed early\n- [x] Study english\n- [ ] Read\n- [x] Fasting after 21 PM\n- [x] Sauna\n- [x] Workout\n- weight : 80.20"
  },
  {
    "date": "2026-01-05",
    "display": "2026년 1월 5일",
    "week": "W2",
    "path": "01. Daily notes/W2/26年 01月 05日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 5日\nday: 월요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n### Daily notes.\n- 수납을 잘 할 수록 물건에서 벗어날 수 없다.\n . 버릴 물건, 남길 물건 선별 작업 이후 수납 할 것.\n- 수납 장소가 분산된 상태에서 장소별로 정리할 경우 영원히 정리는 끝나지 않는다.\n . 장소별이 아니라 물건별로 정리 할 것\n \n- 추억의 물건은 가장 나중에 버려라\n- weight : 79.70\n\n\n"
  },
  {
    "date": "2026-01-04",
    "display": "2026년 1월 4일",
    "week": "W2",
    "path": "01. Daily notes/W2/26年 01月 04日.md",
    "content": "---\ntype: daily\ndate: 26年 01月 19日\nday: 일요일\ntags:\n  - dailyNote\nwakeup:\nsleep:\nweight:\n---\n\n### Daily notes.\n- 가진걸 소중히 여기고 구성원과 행복하게 지낸다\n\n### Tracking.\n- [ ] Wake up early\n- [ ] Go to bed early\n- [ ] Study english\n- [ ] Read\n- [ ] Fasting after 21 PM\n- [ ] Sauna\n- [ ] Workout\n\n\n"
  },
  {
    "date": "2026-01-02",
    "display": "2026년 1월 2일",
    "week": "W1",
    "path": "01. Daily notes/W1/26年 01月 02日.md",
    "content": "-\n\n-\n"
  },
  {
    "date": "2026-01-01",
    "display": "2026년 1월 1일",
    "week": "W1",
    "path": "01. Daily notes/W1/26年 01月 01日.md",
    "content": "내가 선택한 직업이기 때문에 감수해야한다.\n그 누구도 내가 해야하는걸 강요하지 않는다.\n\n"
  },
  {
    "date": "2025-12-26",
    "display": "2025년 12월 26일",
    "week": "W1",
    "path": "01. Daily notes/W1/25年 12月 26日.md",
    "content": "-\n\n-도마 더 큰것\n"
  },
  {
    "date": "2025-12-24",
    "display": "2025년 12월 24일",
    "week": "W1",
    "path": "01. Daily notes/W1/25年 12月 24日.md",
    "content": "-\n\n-\nEleven labs\nSesame AI"
  },
  {
    "date": "2025-12-06",
    "display": "2025년 12월 6일",
    "week": "W1",
    "path": "01. Daily notes/W1/25年 12月 06日.md",
    "content": "나혜와 카\n\nhttps://www.coupang.com/vp/products/5960249746?itemId=10677983258&vendorItemId=80429730960&src=1042503&spec=10304025&addtag=400&ctag=5960249746&lptag=5960249746-10677983258&itime=20251206194939&pageType=PRODUCT&pageValue=5960249746&wPcid=16901194824678248552828&wRef=www.google.com&wTime=20251206194939&redirect=landing&gclid=CjwKCAiAxc_JBhA2EiwAFVs7XGBekk4l0dwH4OIcfhuOkYK2GLoBjaS-8LlWRSrrqGzHsnktlSQ-3BoCUp0QAvD_BwE&mcid=e683978d364044d68ff47672faf7ff56&campaignid=22815108882&adgroupid=\n"
  },
  {
    "date": "2025-12-05",
    "display": "2025년 12월 5일",
    "week": "W1",
    "path": "01. Daily notes/W1/25年 12月 05日.md",
    "content": "갈 - 노 쁠\n빨 - 초\n\n파 - 노하 마\n검 - 빨\n\n\n이천\n아파트먼트풀\n원오디너리맨션\n레트로비\n알코브\n한나하우즈\n이케아"
  },
  {
    "date": "2025-12-04",
    "display": "2025년 12월 4일",
    "week": "W1",
    "path": "01. Daily notes/W1/25年 12月 04日.md",
    "content": "사고 싶은 것\n1. 스피커 https://futureterior.com/shop1/product/detail.html?product_no=2598&linkD=CACGAQOTa\n2. "
  },
  {
    "date": "2025-12-02",
    "display": "2025년 12월 2일",
    "week": "W1",
    "path": "01. Daily notes/W1/25年 12月 02日.md",
    "content": "초보자를 위한 LLM\n지속적으로 다운되는 현상 (STOATOR CTQ)\n\n영어 공부 (묘사)\n1. 서론 본론 결론 구성 (시나리오 꼭 지키기)\n\t1. I usually _ , I do this beause _, For example _\n\t2. I usually _, The reason is that _, I oftend _ when i _\n2. 안정적인 구조, 정확한 단어 선택, 디테일\n3. 형태 + 색상 + 크기 + 분위기 + 기능 (2~3가지 포함)\n4\n\n**오픽 연습 묘사**\n \n**① Introduce → ② Describe → ③ Reason → ④ Example**\n\n###### You indicated in the survey that you like to go to parks. Tell me about one of the parks that you often visit. What makes it so special?\n\n답변\nI will tell youyou, my favorite park is small place near my home,\nit has long walking pass, green trees and a big playground, it's atmosphere is so peaceful.\ni like going there in the atfternoon and have relex and listen to music.\nwhenever that's place makes me feel calm and better, yep, that what i like park! \n\n피드백\nLet me talk about my favorite park is small place near my home.  \nIt has a long walking path, lots of green trees, and a big playground, so the atmosphere is very peaceful.  \nI like going there in the afternoon to relax and listen to music.  \nWhenever I visit the park, it makes me feel calm and refreshed.\n\n\n##### You indicated in the survey that you like to go to parks. Tell me about one of the parks that you often visit. What makes it so special? #방문회수 #특별한점\n\n답변\nyes, um,, i am going to park about once or twice a week\nwhen i going to park near my home, i usually walking along the path about 2 or 3 kliometers,\nand then sit on the bench then strech or drink some water for my body.\nbecuase of that things what i like go to park and walk , that's it\n\n피드백\ni often visit a small park near my home, i usually once or twice a week.\ni walk along the path about two or three kliometers and then.. sit on the bench to strech and drink some water.\nthis palce is special to me, because quiet and mekes me feel better.\nso i really enjoy going there.\n\n\n##### You indicated in the survey that you like to take vacations domestically. Tell me someplace you like to travel. Why do you like going there? #어디가좋니 \n\n답변\nlet me tell you about my favorite place to travel in korea is jeju island.\nbecause it has beautiful coast, hanra mountaiun and great food.\nspecially i like trying fresh seafood. you know,\nso that's whtat i like jeju island.\n\n피드백\nLet me tell you about my favorite place to travel in Korea. It’s Jeju Island.  \nI like it because it has beautiful coasts, Hallasan Mountain, and great food.  \nEspecially, I enjoy trying fresh seafood there.  \nThat’s why I like going to Jeju Island.\n\n####  Let's talk about where you live. What is your neighborhood like? Where is it? What kinds of amenities are there in your neighborhood? Tell me about a place around your house.\n\nOk, let me tell you about my negihbothood,\ni live in small apartment, and also my neighborhood has a lot of apartment.\nand then CVS, school, and restaurants. and quite place.\n\n\nLet me tell you about my neighborhood.  \nI live in a small apartment, and my area has many other apartments around it.  \nThere are convenience stores, a school, and some restaurants nearby.  \nIt’s a pretty quiet place, and I like that about my neighborhood.\n"
  }
];
