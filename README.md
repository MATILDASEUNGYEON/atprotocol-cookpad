# 🍳 AT Protocol Recipe Platform

AT Protocol 기반 레시피 공유 플랫폼입니다. Bluesky의 탈중앙화 프로토콜을 활용하여 레시피를 작성, 공유, 검색할 수 있는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 AT Protocol (Authenticated Transfer Protocol)의 실제 동작 방식을 구현한 full-stack 애플리케이션입니다. 사용자는 Bluesky 계정으로 OAuth 로그인하여 레시피를 작성하고, PDS(Personal Data Server)에 저장할 수 있습니다. Firehose를 통해 실시간으로 레시피 변경사항을 감지하고 AppView에서 인덱싱합니다.

### 주요 특징

- **탈중앙화 인증**: Bluesky OAuth를 통한 로그인
- **AT Protocol 기반 데이터 저장**: 레시피 데이터를 사용자의 PDS에 저장
- **실시간 동기화**: Jetstream을 통한 Firehose 이벤트 수신
- **AppView 인덱싱**: 검색 및 리스트 기능을 위한 중앙 인덱스
- **이미지 업로드**: Blob 업로드를 통한 레시피 썸네일 및 단계별 이미지
- **레시피 관리**: 생성, 조회, 수정, 삭제 (CRUD)

## 🏗️ 아키텍처

```
┌─────────────────┐
│  Next.js Client │ (포트: 5173)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/Cookie
         ↓
┌─────────────────┐
│  Express Server │ (포트: 3000)
│   (Backend API) │
└────────┬────────┘
         │
         ├─→ OAuth Client (Bluesky 인증)
         │
         ├─→ AT Protocol Agent (PDS 통신)
         │   └─→ uploadBlob, createRecord
         │
         ├─→ SQLite Database (AppView)
         │   └─→ 레시피 인덱스
         │
         └─→ Jetstream (Firehose)
             └─→ 실시간 이벤트 수신
```

### AT Protocol 데이터 흐름

```
1. 사용자가 레시피 작성
   ↓
2. Client → POST /api/recipe
   ↓
3. Backend: OAuth 세션 복원
   ↓
4. Backend: Blob 업로드 (이미지 → PDS)
   ↓
5. Backend: Record 생성 (agent.com.atproto.repo.createRecord)
   ↓ at://did/com.cookpad.recipe/3kabc
6. PDS: Firehose Event 발행
   ↓
7. Jetstream: WebSocket으로 이벤트 전달
   ↓
8. Consumer: AppView DB에 인덱싱
   ↓
9. Client: 검색/리스트 페이지에서 조회 가능
```

## 🛠️ 기술 스택

### Backend
- **Node.js** + **TypeScript**
- **Express**: REST API 서버
- **AT Protocol SDK** (`@atproto/api`, `@atproto/oauth-client-node`)
- **Jetstream** (`@skyware/jetstream`): Firehose 이벤트 수신
- **Kysely**: SQL 쿼리 빌더
- **SQLite** (`better-sqlite3`): AppView 데이터베이스
- **Jest**: 테스트 프레임워크

### Frontend
- **Next.js 14**: React 프레임워크
- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안정성

### AT Protocol 구성요소
- **Lexicon**: `com.cookpad.recipe` (레시피 스키마 정의)
- **OAuth Client**: Bluesky 계정 인증
- **PDS Communication**: 레코드 생성/조회/수정/삭제
- **Firehose Consumer**: 실시간 이벤트 처리

## 📁 프로젝트 구조

```
test-atprotocol/
├── src/                      # 백엔드 소스
│   ├── server.ts            # 서버 엔트리포인트
│   ├── app.ts               # Express 앱 설정
│   ├── config/              # 환경 변수 설정
│   ├── db/                  # 데이터베이스
│   │   ├── schema.ts        # 테이블 스키마
│   │   └── migrations/      # DB 마이그레이션
│   ├── firehose/            # Firehose 이벤트 처리
│   │   └── consumer.ts      # Jetstream consumer
│   └── routes/              # API 라우트
│       └── recipe.ts        # 레시피 API
│
├── client/                   # 프론트엔드 (Next.js)
│   ├── app/                 # App Router 페이지
│   │   ├── api/            # API 라우트 핸들러
│   │   │   ├── auth/       # 인증 관련
│   │   │   ├── recipe/     # 레시피 CRUD
│   │   │   └── profile/    # 사용자 프로필
│   │   ├── login/          # 로그인 페이지
│   │   ├── upload/         # 레시피 작성
│   │   ├── recipe/[id]/    # 레시피 상세/수정
│   │   ├── list/           # 레시피 목록
│   │   └── search/         # 검색
│   ├── components/          # React 컴포넌트
│   ├── hooks/              # Custom hooks
│   ├── lib/                # 유틸리티 (agent, oauth)
│   └── types/              # TypeScript 타입 정의
│
├── lexicons/                # AT Protocol Lexicon
│   └── com.cookpad.recipe.json
│
├── tests/                   # 테스트 파일
│   ├── recipe.create.test.ts
│   ├── recipe.read.test.ts
│   ├── recipe.update.test.ts
│   ├── recipe.delete.test.ts
│   └── recipe.integration.test.ts
│
├── package.json             # 백엔드 의존성
└── tsconfig.json            # TypeScript 설정
```

## 🚀 시작하기

### 필수 요구사항

- **Node.js** 18 이상
- **npm**
- **Bluesky 계정** (OAuth 로그인용)

### 1. 저장소 클론

```bash
git clone <repository-url>
cd test-atprotocol
```

### 2. 의존성 설치

```bash
# 백엔드 의존성
npm install

# 프론트엔드 의존성
cd client
npm install
cd ..
```

### 3. 환경 변수 설정

루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
# 서버 설정
HOST=127.0.0.1
PORT=3000

# OAuth 설정
OAUTH_CLIENT_ID=http://localhost
OAUTH_REDIRECT_PATH=/oauth/callback
OAUTH_SCOPE=atproto transition:generic

# 클라이언트 설정
WEB_ORIGIN=http://localhost:5173
```

### 4. 데이터베이스 초기화

서버를 처음 시작하면 자동으로 SQLite 데이터베이스가 생성되고 마이그레이션이 실행됩니다.

### 5. 서버 실행

**개발 모드 (동시 실행):**

터미널 1 - 백엔드:
```bash
npm start
```

터미널 2 - 프론트엔드:
```bash
cd client
npm run dev
```

서버가 실행되면:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Firehose Consumer**: 자동으로 시작됨

### 6. 애플리케이션 접속

브라우저에서 http://localhost:5173 접속 후:
1. "Login with Bluesky" 클릭
2. Bluesky 계정으로 OAuth 인증
3. 레시피 작성 및 관리

## 🧪 테스트

### 전체 테스트 실행

```bash
npm test
```

### 테스트 파일별 실행

```bash
# 레시피 생성 테스트
npm test recipe.create.test.ts

# 레시피 조회 테스트
npm test recipe.read.test.ts

# 레시피 수정 테스트
npm test recipe.update.test.ts

# 레시피 삭제 테스트
npm test recipe.delete.test.ts

# 통합 테스트
npm test recipe.integration.test.ts
```

## 📖 API 엔드포인트

### 인증
- `POST /api/auth/login` - OAuth 로그인 시작
- `GET /api/callback` - OAuth 콜백
- `GET /api/me` - 현재 사용자 정보

### 레시피
- `GET /api/recipes` - 레시피 목록 조회 (필터링 지원)
- `POST /api/recipe` - 레시피 생성
- `GET /api/recipe/:id` - 레시피 상세 조회
- `PUT /api/recipe/:id` - 레시피 수정
- `DELETE /api/recipe/:id` - 레시피 삭제

### 프로필
- `POST /api/profile/update` - 프로필 업데이트

## 📝 Lexicon 스키마

프로젝트는 `com.cookpad.recipe` Lexicon을 사용합니다:

```typescript
{
  title: string              // 레시피 제목 (필수)
  description?: string       // 설명
  ingredients: Array<{       // 재료 목록 (필수)
    type: 'ingredient' | 'section'
    name?: string
    title?: string
  }>
  steps: Array<{            // 조리 단계 (필수)
    text: string
    image?: Blob
  }>
  cookTimeMinutes?: number  // 조리 시간
  servings?: number         // 인분
  thumbnail?: Blob          // 썸네일 이미지
  tags?: string[]           // 태그
  visibility: 'draft' | 'published'  // 공개 상태
}
```

## 🔧 주요 스크립트

```bash
# 백엔드 프로덕션 서버
npm start

# 프론트엔드 개발 서버 (포트 5173)
cd client && npm run dev

# 프론트엔드 빌드
cd client && npm run build
```

## 🌟 주요 기능

### 1. OAuth 인증
- Bluesky 계정으로 간편 로그인
- 세션 관리
- 자동 토큰 갱신

### 2. 레시피 작성
- 에디터를 통한 레시피 작성
- 썸네일 및 단계별 이미지 업로드
- 재료 및 조리 단계 관리
- 인분, 조리시간 설정
- 태그는 자동 생성

### 3. 레시피 검색
- 카테고리별 필터링
- 재료 기반 검색
- 국가별 필터

### 4. 실시간 동기화
- Firehose를 통한 실시간 이벤트 수신
- 자동 AppView 인덱싱
- 다른 사용자의 레시피 즉시 반영

### 5. 레시피 관리
- 내 레시피 목록
- 레시피 수정
- 레시피 삭제
- 공개(Public)/비공개(Private) 설정



## 📚 참고 자료

- [AT Protocol Documentation](https://atproto.com/)
- [Bluesky API](https://docs.bsky.app/)
- [AT Protocol OAuth](https://atproto.com/specs/oauth)
- [Jetstream](https://github.com/skyware-js/jetstream)
