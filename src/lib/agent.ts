import { AtpAgent } from '@atproto/api'
import { oauthClient } from '../auth/oauthClient'
import type { OAuthSession } from '@atproto/oauth-client-node'

export async function getAgentByDid(did: string): Promise<{ agent: AtpAgent; did: string; session: OAuthSession } | null> {
  const oauthSession = await oauthClient.restore(did)
  if (!oauthSession) return null

  // OAuth 세션의 PDS URL 사용
  const pdsUrl = oauthSession.serverMetadata.issuer
  
  // OAuth 세션의 fetchHandler를 표준 fetch 형식으로 래핑
  const authenticatedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input instanceof Request ? input.url : input.toString()
    return oauthSession.fetchHandler(url, init)
  }
  
  // AtpAgent 생성 - 인증된 fetch 사용 (PDS 전용)
  const agent = new AtpAgent({
    service: pdsUrl,
    fetch: authenticatedFetch,
  })
  
  // OAuth 세션의 DID와 세션 정보 반환
  return {
    agent,
    did: oauthSession.sub, // DID
    session: oauthSession,
  }
}
