import { createOAuthClient } from './auth/client'
import { db } from './db'

let oauthClientInstance: Awaited<ReturnType<typeof createOAuthClient>> | null = null

export async function getOAuthClient() {
  if (!oauthClientInstance) {
    oauthClientInstance = await createOAuthClient(db)
  }
  return oauthClientInstance
}
