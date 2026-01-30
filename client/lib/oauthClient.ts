import { NodeOAuthClient } from '@atproto/oauth-client-node'
import type { NodeSavedState, NodeSavedSession } from '@atproto/oauth-client-node'

// Next.js 전용 OAuth Client (Express 서버와 분리)
// Express 서버의 DB를 import하는 대신 메모리 기반 스토어 사용

const OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID ?? 'http://localhost'
const OAUTH_REDIRECT_URI = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI ?? 'http://localhost:5173/callback'
const OAUTH_SCOPE = process.env.NEXT_PUBLIC_OAUTH_SCOPE ?? 'atproto transition:generic'
console.log('🔧 OAuth 설정:')
console.log('  - CLIENT_ID:', OAUTH_CLIENT_ID)
console.log('  - REDIRECT_URI:', OAUTH_REDIRECT_URI)
console.log('  - SCOPE:', OAUTH_SCOPE)
// 메모리 기반 State Store (개발용)
const stateStore = {
  store: new Map<string, NodeSavedState>(),
  async set(key: string, val: NodeSavedState) {
    this.store.set(key, val)
  },
  async get(key: string) {
    return this.store.get(key)
  },
  async del(key: string) {
    this.store.delete(key)
  },
}

// 메모리 기반 Session Store (개발용)
const sessionStore = {
  store: new Map<string, NodeSavedSession>(),
  async set(sub: string, session: NodeSavedSession) {
    this.store.set(sub, session)
  },
  async get(sub: string) {
    return this.store.get(sub)
  },
  async del(sub: string) {
    this.store.delete(sub)
  },
}

export const oauthClient = new NodeOAuthClient({
  clientMetadata: {
    client_id: `${OAUTH_CLIENT_ID}?${new URLSearchParams({
      redirect_uri: OAUTH_REDIRECT_URI,
      scope: OAUTH_SCOPE,
    })}`,

    redirect_uris: [OAUTH_REDIRECT_URI],
    scope: OAUTH_SCOPE,
    token_endpoint_auth_method: 'none',
    application_type: 'web',
  },

  stateStore,
  sessionStore,
  handleResolver: 'https://bsky.social',
})
