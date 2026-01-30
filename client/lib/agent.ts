// import { Agent } from '@atproto/api'
// import { oauthClient } from './oauthClient'

// /**
//  * Next.js Route Handler 전용 Agent 생성 함수
//  * Express 서버 코드와 완전히 분리됨
//  * 
//  * @param did - 사용자 DID (쿠키에서 가져옴)
//  * @returns Agent 인스턴스와 세션 정보
//  */
// export async function getSessionAgent(did: string) {
//   try {
//     const oauthSession = await oauthClient.restore(did)
    
//     if (!oauthSession) {
//       throw new Error(`세션을 찾을 수 없습니다: ${did}`)
//     }

//     console.log('🔍 OAuth 세션 복원:')
//     console.log('  - DID:', oauthSession.sub)
    
//     const agent = new Agent(oauthSession)

//     return {
//       agent,
//       did: oauthSession.sub,
//       session: oauthSession,
//     }
//   } catch (error) {
//     console.error('❌ Agent 생성 실패:', error)
//     throw error
//   }
// }

import { AtpAgent } from '@atproto/api'
import { getOAuthClient } from './oauth'
import type { OAuthSession } from '@atproto/oauth-client-node'

export async function getSessionAgent(did: string) {
  const oauthClient = await getOAuthClient()
  const oauthSession = await oauthClient.restore(did)
  
  if (!oauthSession) {
    throw new Error(`세션을 찾을 수 없습니다: ${did}`)
  }

  const pdsUrl = oauthSession.serverMetadata.issuer

  if (!pdsUrl) {
    throw new Error('PDS URL not found in OAuth session')
  }

  const authenticatedFetch = (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    const url = input instanceof Request ? input.url : input.toString()
    return oauthSession.fetchHandler(url, init)
  }

  const agent = new AtpAgent({
    service: pdsUrl,
    fetch: authenticatedFetch,
  })

  return {
    agent,
    did: oauthSession.sub,
    session: oauthSession,
  }
}

export async function getAgentByDid(
  did: string,
): Promise<{ agent: AtpAgent; did: string; session: OAuthSession } | null> {
  try {
    return await getSessionAgent(did)
  } catch {
    return null
  }
}
