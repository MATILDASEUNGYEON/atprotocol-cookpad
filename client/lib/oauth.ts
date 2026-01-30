import { createOAuthClient } from './auth/client'
import { db } from './db'

// OAuth client 싱글톤
let oauthClientInstance: Awaited<ReturnType<typeof createOAuthClient>> | null = null

export async function getOAuthClient() {
  if (!oauthClientInstance) {
    oauthClientInstance = await createOAuthClient(db)
  }
  return oauthClientInstance
}
