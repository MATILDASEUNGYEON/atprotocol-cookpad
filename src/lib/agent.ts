// src/lib/agent.ts
import { AtpAgent } from '@atproto/api'
import { oauthClient } from '../auth/oauthClient'
import type { OAuthSession } from '@atproto/oauth-client-node'

export async function getAgentByDid(
  did: string,
): Promise<{ agent: AtpAgent; did: string; session: OAuthSession } | null> {
  const oauthSession = await oauthClient.restore(did)
  if (!oauthSession) return null

  // ✅ OAuth issuer = PDS URL
  const pdsUrl = oauthSession.serverMetadata.issuer

  if (!pdsUrl) {
    throw new Error('PDS URL not found in OAuth session metadata')
  }

  // ✅ OAuth 세션에 바인딩된 fetch 그대로 사용
  const authenticatedFetch = (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => {
    const url =
      input instanceof Request ? input.url : input.toString()
    return oauthSession.fetchHandler(url, init)
  }

  const agent = new AtpAgent({
    service: pdsUrl,
    fetch: authenticatedFetch,
  })

  return {
    agent,
    did: oauthSession.sub, // DID
    session: oauthSession,
  }
}
