/**
 * Jest 테스트 환경 설정
 */
import dotenv from 'dotenv'
import { resolve } from 'path'

// .env 파일 로드 (.env와 .env.test 모두)
dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '.env.test'), override: true })

// 테스트 환경임을 명시
process.env.NODE_ENV = 'test'

// 테스트용 DID가 없으면 경고
if (!process.env.TEST_DID) {
  console.warn('⚠️  TEST_DID 환경변수가 설정되지 않았습니다.')
  console.warn('   설정: $env:TEST_DID="did:plc:your_actual_did"\n')
}
