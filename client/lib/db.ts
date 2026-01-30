import { createDb } from '#/db'
import path from 'path'

// Next.js API routes용 Database 인스턴스
export const db = createDb(path.join(process.cwd(), 'data.db'))
