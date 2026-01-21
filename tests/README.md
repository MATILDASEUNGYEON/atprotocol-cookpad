# Recipe CRUD 단위 테스트 가이드

## 🎯 개요

ATProtocol의 `com.cookpad.recipe` Lexicon을 사용한 레시피 CRUD 단위 테스트입니다.

## 📋 전제 조건

### 1. OAuth 로그인 완료
```bash
npm run dev
```
브라우저에서 OAuth 로그인을 완료하고 세션을 생성하세요.

### 2. 환경 변수 설정
로그인 후 콘솔에 출력되는 DID를 확인하고 설정:

```bash
# Windows PowerShell
$env:TEST_DID="did:plc:your_actual_did_here"

# Linux/Mac
export TEST_DID="did:plc:your_actual_did_here"
```

또는 `.env` 파일에 추가:
```
TEST_DID=did:plc:your_actual_did_here
```

## 🧪 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### 특정 테스트 파일 실행
```bash
npm test recipe.create.test
npm test recipe.read.test
npm test recipe.update.test
npm test recipe.delete.test
```

### Watch 모드
```bash
npm run test:watch
```

## 📁 파일 구조

```
tests/
├── helpers.ts              # 공통 헬퍼 함수
├── recipe.create.test.ts   # CREATE 테스트
├── recipe.read.test.ts     # READ 테스트
├── recipe.update.test.ts   # UPDATE 테스트
└── recipe.delete.test.ts   # DELETE 테스트
```

## ✅ 테스트 체크리스트

### CREATE
- [x] 레시피 생성 성공
- [x] URI 및 CID 생성 확인
- [x] 필수 필드 누락 시 실패
- [x] 잘못된 데이터 타입 검증
- [x] 최소 레시피 생성
- [x] 태그 포함 레시피 생성

### READ
- [x] URI로 레시피 조회
- [x] 모든 필드 반환 확인
- [x] 조리 단계 구조 검증
- [x] 존재하지 않는 레코드 에러
- [x] listRecords로 목록 조회

### UPDATE
- [x] 레시피 전체 수정
- [x] 수정 내용 조회 확인
- [x] 재료 목록 수정
- [x] 조리 단계 추가/수정
- [x] 태그 추가
- [x] 필수 필드 제거 시 실패
- [x] 잘못된 타입 검증

### DELETE
- [x] 레시피 삭제 성공
- [x] 삭제 후 조회 불가
- [x] 존재하지 않는 레코드 삭제
- [x] 중복 삭제 방지
- [x] 여러 레시피 순차 삭제
- [x] 동일 rkey 재사용

## 🔍 핵심 개념

### ATProtocol UPDATE의 특징
```typescript
// ❌ 부분 업데이트 (불가능)
await agent.com.atproto.repo.putRecord({
  record: { description: '새 설명' }  // 다른 필드가 사라짐!
})

// ✅ 전체 교체 (올바른 방법)
const current = await agent.com.atproto.repo.getRecord(...)
await agent.com.atproto.repo.putRecord({
  record: {
    ...current.value,
    description: '새 설명',
    updatedAt: new Date().toISOString(),
  }
})
```

### Lexicon 자동 검증
- PDS가 Lexicon 스키마를 자동으로 검증
- 필수 필드 누락 → 에러
- 타입 불일치 → 에러
- maxLength 초과 → 에러

### URI 구조
```
at://did:plc:abc123/com.cookpad.recipe/3jui7kd54zh2y
     └─ DID      └─ Collection      └─ rkey
```

## 🚀 다음 단계

### 옵션 A: AppView 개발
1. Firehose 구독
2. Recipe commit 인덱싱
3. 검색/목록 API 구현

### 옵션 B: UI 개발
1. React에서 createRecord 호출
2. 레시피 목록 화면
3. 수정/삭제 기능

### 옵션 C: Blob 업로드
```typescript
const blob = await agent.com.atproto.repo.uploadBlob(
  imageBuffer,
  { encoding: 'image/jpeg' }
)

record.coverImage = blob.data.blob
```

## ⚠️ 주의사항

1. **테스트 격리**: 각 테스트는 독립적으로 실행되어야 함
2. **실제 PDS 사용**: 목 서버가 아닌 실제 PDS에 연결
3. **세션 유효성**: OAuth 세션이 만료되면 재로그인 필요
4. **Rate Limiting**: 과도한 요청 시 제한될 수 있음

## 📚 참고 자료

- [ATProtocol 공식 문서](https://atproto.com/)
- [Lexicon 스키마 가이드](https://atproto.com/specs/lexicon)
- [@atproto/api 문서](https://github.com/bluesky-social/atproto/tree/main/packages/api)
