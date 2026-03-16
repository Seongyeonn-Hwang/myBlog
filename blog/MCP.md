---
title: MCP (Model Context Protocol) 공부 자료
date: 2026-03-16
tags:
  - AI
  - MCP
  - Protocol
  - Learning
---

# MCP (Model Context Protocol) 📚

## 개요

**MCP(Model Context Protocol)**는 Anthropic에서 개발한 개방형 표준 프로토콜로, Claude와 같은 AI 모델이 외부 도구, 데이터 소스, 시스템과 안전하게 상호작용할 수 있도록 합니다.

---

## 핵심 개념

### 1. 역할과 구조

```
┌─────────────┐
│   Client    │  (Claude, 대화형 애플리케이션)
└──────┬──────┘
       │ MCP 프로토콜
       │
┌──────▼──────┐
│   Server    │  (도구, 데이터 제공자)
└─────────────┘
```

- **Client**: MCP를 통해 기능을 요청하는 측 (Claude, IDE 등)
- **Server**: 리소스, 도구, 자원을 제공하는 측

### 2. 주요 개념

| 개념 | 설명 |
|------|------|
| **Resources** | 서버가 제공하는 데이터 또는 정보 (파일, DB, API 응답) |
| **Tools** | 클라이언트가 호출할 수 있는 함수/작업 |
| **Prompts** | 특정 작업을 위한 사전 구성된 지시사항 |
| **Sampling** | 서버가 클라이언트(Claude)를 호출하도록 요청 |

---

## MCP의 주요 특징

### ✅ 장점

- **표준화**: 일관된 인터페이스로 다양한 도구 연결
- **보안**: 권한 관리와 샌드박스 환경 지원
- **확장성**: 새로운 도구 및 리소스 쉽게 추가 가능
- **양방향 통신**: 클라이언트와 서버 간 양방향 상호작용
- **개발자 친화적**: 표준 프로토콜로 개발 난이도 감소

### 🎯 사용 사례

- 📁 **파일 시스템 접근** - 로컬 파일 읽기/쓰기
- 🗄️ **데이터베이스 연결** - SQL 쿼리, 데이터 조회
- 🌐 **웹 API 통합** - 외부 서비스 호출
- 🛠️ **개발 도구 연동** - Git, 빌드 도구, 패키지 관리자
- 📊 **비즈니스 소프트웨어** - CRM, 협업 도구 연동
- 🔍 **검색 & 분석** - 문서 검색, 데이터 분석

---

## MCP 아키텍처

### 통신 흐름

1. **Client Request** → 서버에 도구 실행 요청
2. **Server Processing** → 요청된 작업 처리
3. **Server Response** → 결과 반환
4. **Context Update** → Claude의 컨텍스트 업데이트

### 메시지 형식

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {
      "arg1": "value1"
    }
  }
}
```

---

## 실제 예시

### 파일 서버 MCP

```
사용자: "README.md 파일을 읽어줘"
  ↓
Claude (Client): MCP를 통해 파일 읽기 요청
  ↓
File Server (Server): README.md 파일 내용 반환
  ↓
Claude: 파일 내용 분석 및 요약 제공
```

### 데이터베이스 MCP

```
사용자: "2026년 3월의 판매 통계를 보여줘"
  ↓
Claude (Client): MCP를 통해 SQL 쿼리 실행 요청
  ↓
Database Server: 쿼리 실행 후 결과 반환
  ↓
Claude: 데이터 분석 및 시각화
```

---

## MCP의 보안 특성

### 🔒 보안 메커니즘

- **권한 기반 접근 제어 (RBAC)** - 특정 리소스에만 접근 권한 부여
- **감시 로깅** - 모든 상호작용 기록
- **샌드박스 격리** - 서버별 독립된 실행 환경
- **인증/인가** - 토큰 기반 인증

> [!warning]
> MCP 서버는 신뢰할 수 있는 출처에서만 설치해야 합니다. 악의적인 서버는 시스템에 접근할 수 있습니다.

---

## 개발자 관점: MCP 서버 만들기

### 최소 MCP 서버 구조

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("my-tool-server")

@server.call_tool()
async def list_files(path: str):
    """파일 목록 조회"""
    return [TextContent(type="text", text=str(os.listdir(path)))]

if __name__ == "__main__":
    server.run()
```

### 주요 구현 단계

1. **서버 초기화** - MCP Server 인스턴스 생성
2. **리소스/도구 정의** - 제공할 기능 선언
3. **핸들러 구현** - 요청에 대한 로직 작성
4. **서버 실행** - HTTP 또는 stdio로 통신

---

## MCP vs 다른 기술

| 항목 | MCP | REST API | 플러그인 |
|------|-----|----------|---------|
| 표준화 | ✅ 표준화됨 | ❌ 각자 다름 | ❌ 각자 다름 |
| 양방향 | ✅ 지원 | ❌ 단방향 | ✅ 지원 |
| 보안 | ✅ 내장 | ⚠️ 별도 구현 | ⚠️ 별도 구현 |
| 학습곡선 | ⭐⭐ | ⭐ | ⭐⭐⭐ |

---

## 현재 상태 (2026년 3월)

- 🚀 **현황**: Anthropic 공식 지원 프로토콜
- 📦 **에코시스템**: 다양한 공식 MCP 서버 제공
- 👥 **커뮤니티**: 활발한 커뮤니티 개발 중
- 📚 **문서**: 공식 문서 및 예제 제공

---

## 학습 로드맵

### 📍 초급 (입문)
- [ ] MCP 기본 개념 이해
- [ ] 공식 문서 읽기
- [ ] 제공되는 MCP 서버 사용해보기

### 📍 중급 (실전)
- [ ] 간단한 MCP 서버 만들어보기
- [ ] 기존 도구와 MCP 연동
- [ ] 에러 처리 및 로깅 구현

### 📍 고급 (심화)
- [ ] 복잡한 도구 개발
- [ ] 보안 고려사항 구현
- [ ] 커뮤니티 기여

---

## 참고자료

### 공식 자료
- 🔗 [Anthropic MCP 공식 문서](https://modelcontextprotocol.io)
- 📖 [MCP 사양서](https://spec.modelcontextprotocol.io)
- 🛠️ [MCP SDK](https://github.com/anthropics/mcp-sdk)

### 커뮤니티
- 💬 Discord/Slack MCP 커뮤니티
- 🐙 GitHub MCP 프로젝트들
- 📰 MCP 관련 블로그 글

---

## 개인 학습 노트

> [!note]
> 여기에 학습하면서 정리한 내용을 추가해보세요!

### 내가 이해한 MCP의 핵심
-

### 실제로 사용해본 MCP 도구
-

### 궁금한 점
-

### 다음 학습 목표
-

