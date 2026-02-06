import { createDb } from '#/db'
import path from 'path'

export const db = createDb(path.join(process.cwd(), 'data.db'))
