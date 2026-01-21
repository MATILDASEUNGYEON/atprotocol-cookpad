#!/usr/bin/env node

/**
 * 테스트 실행 전 체크리스트 및 가이드
 */

console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🧪 Recipe CRUD 단위 테스트 실행 가이드                    ║
╚═══════════════════════════════════════════════════════════╝

📋 실행 전 체크리스트:

  ✅ OAuth 로그인 완료
     → npm run dev 실행하여 브라우저에서 로그인
  
  ✅ TEST_DID 환경변수 설정
     → 로그인 후 콘솔에 출력되는 DID 복사
     
     Windows PowerShell:
     $env:TEST_DID="did:plc:your_actual_did"
     
     Linux/Mac:
     export TEST_DID="did:plc:your_actual_did"
  
  ✅ 패키지 설치 완료
     → npm install (이미 완료)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 테스트 실행 명령어:

  1️⃣  전체 테스트 실행
     npm test

  2️⃣  특정 테스트만 실행
     npm test recipe.create.test    # CREATE 테스트만
     npm test recipe.read.test      # READ 테스트만
     npm test recipe.update.test    # UPDATE 테스트만
     npm test recipe.delete.test    # DELETE 테스트만
     npm test recipe.integration    # 통합 테스트만

  3️⃣  Watch 모드 (자동 재실행)
     npm run test:watch

  4️⃣  단일 테스트만 실행
     npm test -- -t "레시피를 생성할 수 있다"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 테스트 파일 구조:

  tests/
  ├── helpers.ts                  # 공통 헬퍼 함수
  ├── recipe.create.test.ts       # CREATE 테스트
  ├── recipe.read.test.ts         # READ 테스트
  ├── recipe.update.test.ts       # UPDATE 테스트
  ├── recipe.delete.test.ts       # DELETE 테스트
  ├── recipe.integration.test.ts  # 통합 시나리오
  └── README.md                   # 자세한 가이드

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Lexicon 파일:

  lexicons/com.cookpad.recipe.json
  → ATProtocol 레시피 스키마 정의
  → PDS가 자동으로 유효성 검증

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 테스트 시나리오:

  CREATE: ✅ 레시피 생성, 유효성 검증, URI/CID 확인
  READ:   ✅ 단건 조회, 목록 조회, 필드 검증
  UPDATE: ✅ 전체 수정, 필드별 수정, 타입 검증
  DELETE: ✅ 삭제, 삭제 후 조회 불가, 중복 삭제 방지

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  주의사항:

  • 실제 PDS에 연결하여 테스트합니다
  • OAuth 세션이 만료되면 재로그인 필요
  • 테스트 실행 시 실제 레코드가 생성/삭제됩니다
  • Rate limiting에 주의하세요

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 다음 단계:

  옵션 A: AppView 개발
    → Firehose 구독 및 인덱싱

  옵션 B: UI 개발
    → React에서 createRecord 호출

  옵션 C: Blob 업로드
    → 이미지 업로드 기능 추가

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

문서: tests/README.md를 참고하세요!

`)

// 환경 변수 확인
const testDid = process.env.TEST_DID
if (!testDid || testDid === 'did:plc:YOUR_DID_HERE') {
  console.log(`⚠️  경고: TEST_DID가 설정되지 않았습니다!`)
  console.log(`\n   다음 명령어로 설정하세요:`)
  console.log(`   $env:TEST_DID="did:plc:your_actual_did"\n`)
} else {
  console.log(`✅ TEST_DID 설정됨: ${testDid}\n`)
  console.log(`🚀 준비 완료! 다음 명령어로 테스트를 시작하세요:`)
  console.log(`   npm test\n`)
}
