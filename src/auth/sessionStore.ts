import type { NodeSavedSession } from '@atproto/oauth-client-node'
import { db } from '../server'

export const sessionStore = {
  async set(sub: string, session: NodeSavedSession) {
    await db
      .insertInto('auth_session')
      .values({
        key: sub,
        session: JSON.stringify(session),
      })
      .onConflict((oc: any) =>
        oc.column('key').doUpdateSet({
          session: JSON.stringify(session),
        }),
      )
      .execute()
  },

  async get(sub: string) {
    const row = await db
      .selectFrom('auth_session')
      .selectAll()
      .where('key', '=', sub)
      .executeTakeFirst()

    return row ? (JSON.parse(row.session) as NodeSavedSession) : undefined
  },

  async del(sub: string) {
    await db
      .deleteFrom('auth_session')
      .where('key', '=', sub)
      .execute()
  },
}
