import { createDb, migrateToLatest } from '#/db'
import path from 'path'

export const db = createDb(path.join(process.cwd(), 'data.db'))

migrateToLatest(db).catch((err) => {
  console.error('Database migration failed:', err)
  process.exit(1)
})
