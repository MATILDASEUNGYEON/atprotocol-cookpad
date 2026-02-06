import SqliteDb from 'better-sqlite3'
import {
  Kysely,
  Migrator,
  SqliteDialect,
  MigrationProvider,
} from 'kysely'
import { DatabaseSchema } from './schema'
import { migration0001 } from './migrations/0001.init'
import * as migration0002 from './migrations/0002.appview'

export type Database = Kysely<DatabaseSchema>

const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return {
      '0001-init': migration0001,
      '0002-appview': migration0002,
    }
  },
}

export const createDb = (location: string): Database => {
  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new SqliteDb(location),
    }),
  })
}

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider })
  const { error } = await migrator.migrateToLatest()
  if (error) throw error
}

export let db: Database

export const initializeDb = (location: string): Database => {
  db = createDb(location)
  return db
}
