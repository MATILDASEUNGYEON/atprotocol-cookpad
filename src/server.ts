import { app } from './app'
import { SERVER_ORIGIN } from './config/env'
import { createDb, migrateToLatest } from './db'

export const db = createDb('./data.db')

const PORT = parseInt(process.env.PORT ?? '3000')

// DB 마이그레이션 실행
migrateToLatest(db)
  .then(() => {
    console.log('✅ DB 마이그레이션 완료')
  })
  .catch((err) => {
    console.error('❌ DB 마이그레이션 실패:', err)
    process.exit(1)
  })

const server = app.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log(`✅ 서버 시작: ${SERVER_ORIGIN}`)
  console.log('='.repeat(50))
})

server.on('error', (error) => {
  console.error('❌ 서버 에러:', error)
})
