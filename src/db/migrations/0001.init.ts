import { Migration } from 'kysely'

export const migration0001: Migration = {
  async up(db) {
    await db.schema
      .createTable('auth_state')
      .addColumn('key', 'varchar', (c) => c.primaryKey())
      .addColumn('state', 'varchar', (c) => c.notNull())
      .execute()

    await db.schema
      .createTable('auth_session')
      .addColumn('key', 'varchar', (c) => c.primaryKey())
      .addColumn('session', 'varchar', (c) => c.notNull())
      .execute()
  },

  async down(db) {
    await db.schema.dropTable('auth_state').execute()
    await db.schema.dropTable('auth_session').execute()
  },
}
