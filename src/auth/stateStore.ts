import type { NodeSavedState } from '@atproto/oauth-client-node'
import { db } from '../server'

export const stateStore = {
  async set(key: string, val: NodeSavedState) {
    await db
      .insertInto('auth_state')
      .values({
        key,
        state: JSON.stringify(val),
      })
      .onConflict((oc: any) =>
        oc.column('key').doUpdateSet({
          state: JSON.stringify(val),
        }),
      )
      .execute()
  },

  async get(key: string) {
    const row = await db
      .selectFrom('auth_state')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? (JSON.parse(row.state) as NodeSavedState) : undefined
  },

  async del(key: string) {
    await db
      .deleteFrom('auth_state')
      .where('key', '=', key)
      .execute()
  },
}
