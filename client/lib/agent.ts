import { Agent } from '@atproto/api'
import { getOAuthClient } from './oauth'
import type { OAuthSession } from '@atproto/oauth-client-node'

export async function getSessionAgent(did: string) {
  const oauthClient = await getOAuthClient()
  const oauthSession = await oauthClient.restore(did)
  
  if (!oauthSession) {
    throw new Error(`세션을 찾을 수 없습니다: ${did}`)
  }

  const agent = new Agent(oauthSession)

  return {
    agent,
    did: oauthSession.sub,
    session: oauthSession,
  }
}

export async function getAgentByDid(
  did: string,
): Promise<{ agent: Agent; did: string; session: OAuthSession } | null> {
  try {
    return await getSessionAgent(did)
  } catch {
    return null
  }
}
