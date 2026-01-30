import { oauthClient } from '../src/auth/oauthClient'
import { Agent } from '@atproto/api'

/**
 * 테스트 헬퍼: OAuth 세션을 통해 Agent 생성
 * 
 * 사용 전 조건:
 * 1. OAuth 로그인 완료
 * 2. sessionStore에 세션 저장됨
 * 
 * @param did - 사용자 DID
 * @returns Agent 인스턴스와 세션 정보
 */
export async function getTestAgent(did: string) {
  const oauthSession = await oauthClient.restore(did)
  
  if (!oauthSession) {
    throw new Error(`세션을 찾을 수 없습니다: ${did}`)
  }

  console.log('🔍 OAuth 세션 정보:')
  console.log('  - DID:', oauthSession.sub)
  console.log('  - PDS Issuer:', oauthSession.serverMetadata.issuer)
  
  // OAuth 클라이언트가 제공하는 fetch를 직접 래핑
  // DPoP 토큰을 포함한 올바른 인증 헤더가 자동으로 추가됩니다
  const agent = new Agent(oauthSession)

  return {
    agent,
    did: oauthSession.sub,
    session: oauthSession,
  }
}

/**
 * 테스트용 레시피 데이터 생성
 */
export function createTestRecipe(overrides?: Partial<any>) {
  return {
    title: '테스트 연어 파스타',
    description: '간단한 연어 파스타 레시피',
    ingredients: ['연어', '파스타', '생크림', '마늘', '올리브유'],
    steps: [
      { text: '파스타를 소금물에 삶는다' },
      { text: '연어를 올리브유에 굽는다' },
      { text: '생크림과 마늘을 넣고 소스를 만든다' },
      { text: '파스타와 소스를 섞는다' },
    ],
    cookTimeMinutes: 25,
    servings: 2,
    tags: ['파스타', '연어', '양식'],
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}
