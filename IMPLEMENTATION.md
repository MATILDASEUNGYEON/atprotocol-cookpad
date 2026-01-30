# AT Protocol 레시피 업로드 구현 완료 ✅

## 📋 구현된 흐름

제시하신 **AT Protocol의 정확한 작동 순서**대로 구현이 완료되었습니다.

---

## 🔄 전체 흐름 (구현된 순서)

```
User UI (Upload Page)
  ↓
  [1] Publish 버튼 클릭
  ↓
  [2] POST /api/recipe (FormData)
  ↓
  [3] OAuth 세션 복원 (getSessionAgent)
      → PDS issuer 확인
      → access token 검증
  ↓
  [4] Blob 업로드 (agent.uploadBlob)
      → Thumbnail 이미지 → PDS
      → Step 이미지들 → PDS
      → Blob refs 반환
  ↓
  [5] Recipe Record 생성
      → agent.com.atproto.repo.createRecord()
      → at://did/com.cookpad.recipe/3kabc
      ✨ 이 순간 "AT Protocol 객체" 탄생
  ↓
  [6] Firehose Event 자동 발생
      → PDS가 commit event 발행
  ↓
  [7] Jetstream 수신
      → WebSocket으로 이벤트 전달
  ↓
  [8] AppView Consumer가 인덱싱
      → src/firehose/consumer.ts
      → recipe 테이블에 저장
  ↓
  [9] 검색 페이지에서 조회 가능
      → AppView DB에서 읽기
```

---

## 📁 수정/생성된 파일

### 1. **client/app/api/recipe/route.ts** ✨ 핵심
```typescript
// ✅ 구현된 내용:
- FormData 파싱 (이미지 + 텍스트)
- OAuth 세션 복원
- Blob 업로드 (thumbnail + step images)
- Recipe record 생성
- PDS에 저장
```

### 2. **src/firehose/consumer.ts** 🔥 신규 생성
```typescript
// ✅ 구현된 내용:
- Jetstream 연결
- com.cookpad.recipe collection 감지
- onCreate / onUpdate / onDelete 핸들러
- AppView DB 인덱싱
```

### 3. **src/db/schema.ts** 📊
```typescript
// ✅ 추가된 내용:
export type Recipe = {
  uri: string              // at:// URI
  cid: string              // content hash
  author_did: string       // 작성자 DID
  title: string
  description?: string
  servings?: number
  cook_time_minutes?: number
  thumbnail_url?: string
  tags: string[]
  visibility: 'draft' | 'published'
  created_at: string
  indexed_at: string       // AppView 인덱싱 시간
}
```

### 4. **src/db/migrations/0002.appview.ts** 📦
```typescript
// ✅ AppView용 recipe 테이블 생성
- recipe 테이블 (검색/리스트용)
- 인덱스: author_did, visibility, created_at
```

### 5. **src/server.ts** 🚀
```typescript
// ✅ Firehose consumer 시작 코드 추가
startFirehoseConsumer()
```

---

## 🔑 AT Protocol 핵심 개념 (코드에 반영됨)

| 개념 | 구현 위치 | 설명 |
|------|----------|------|
| **DID** | `getSessionAgent()` | 사용자 주권 ID |
| **OAuth Session** | `oauthClient.restore()` | PDS 인증 |
| **Blob** | `agent.uploadBlob()` | 이미지를 PDS에 저장 |
| **Record** | `createRecord()` | 레시피 데이터 (AT Protocol 객체) |
| **Repo** | `repo: did` | 사용자의 데이터 저장소 |
| **Firehose** | PDS 자동 발생 | 변경 알림 스트림 |
| **Jetstream** | `new Jetstream()` | Firehose 중계 서비스 |
| **AppView** | `src/firehose/consumer.ts` | 검색용 인덱스 DB |

---

## 💡 중요한 AT Protocol 특징

### 1. **Blob은 Record와 별도**
```typescript
// ❌ 이미지를 record에 직접 포함 X
// ✅ 이미지를 먼저 업로드 → blob ref 받음 → record에 ref 포함

const blob = await agent.uploadBlob(imageBytes)
// → { ref: { $link: 'bafkreiabc123...' } }

record.thumbnail = blob.data.blob
```

### 2. **Record 생성 = Firehose 이벤트 자동 발생**
```typescript
await agent.createRecord(...)
// → PDS가 자동으로 commit event 발행
// → Jetstream이 자동으로 수신
// → 별도의 "알림" API 호출 불필요!
```

### 3. **AppView는 "복제"가 아니라 "뷰"**
```typescript
// PDS: 원본 데이터 (at:// URI로 접근)
// AppView: 검색용 인덱스 (SQL 쿼리 가능)

// 사용자가 검색할 때는 AppView를 쿼리
// 사용자가 레시피를 수정할 때는 PDS를 업데이트
```

---

## 🧪 테스트 방법

### 1. 서버 시작
```bash
npm start
```

콘솔에 다음이 출력되어야 함:
```
✅ DB 마이그레이션 완료
🔥 Starting Firehose Consumer...
📡 Connecting to Jetstream: wss://jetstream2.us-east.bsky.network/subscribe
✅ Firehose Consumer started
👂 Listening for com.cookpad.recipe events...
```

### 2. 레시피 업로드
1. `/upload` 페이지 접속
2. 레시피 정보 입력 (제목, 재료, 단계)
3. 이미지 업로드
4. **Publish** 버튼 클릭

### 3. 콘솔 로그 확인
```
🔐 OAuth session restore for DID: did:plc:xxx
📤 Uploading blobs to PDS...
✅ Thumbnail uploaded: { ... }
✅ Step 0 image uploaded: { ... }
📝 Creating recipe record on PDS...
✅ Recipe record created: at://did:plc:xxx/com.cookpad.recipe/3kabc

📥 New recipe created: { title: "..." }
✅ Recipe indexed successfully
```

### 4. DB 확인
```bash
sqlite3 data.db "SELECT * FROM recipe;"
```

---

## 📦 설치된 패키지

```json
{
  "@skyware/jetstream": "^latest",
  "ws": "^latest",
  "@types/ws": "^latest"
}
```

---

## ✅ 구현 완료 체크리스트

- [x] OAuth 세션 복원
- [x] FormData 처리 (이미지 + JSON)
- [x] Blob 업로드 (PDS)
- [x] Record 생성 (PDS)
- [x] Firehose consumer (Jetstream)
- [x] AppView DB 인덱싱
- [x] Migration 파일 작성
- [x] 서버 시작 시 consumer 자동 실행

---

## 🎯 결론

**제시하신 AT Protocol 흐름을 100% 그대로 구현했습니다.**

특히:
- ✅ **순서가 정확함**: OAuth → Blob → Record → Firehose
- ✅ **분리가 명확함**: PDS(원본) ↔️ AppView(인덱스)
- ✅ **자동화가 구현됨**: Record 생성 즉시 Firehose 이벤트 발생

이제 사용자가 레시피를 업로드하면:
1. PDS에 진짜 "AT Protocol 레시피"가 생성되고
2. Firehose를 통해 자동으로 전파되며
3. AppView에서 검색 가능해집니다

**AT Protocol의 핵심 철학인 "user sovereignty" (사용자 주권)이 구현되었습니다!** 🎉
