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

// 테스트 환경에서는 서버를 시작하지 않음
let server: any

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log('='.repeat(50))
    console.log(`✅ 서버 시작: ${SERVER_ORIGIN}`)
    console.log('='.repeat(50))
  })

  if (server) {
    server.on('error', (error: Error) => {
      console.error('❌ 서버 에러:', error)
    })
  }
} else {
  console.log('🧪 테스트 모드: 서버 시작 건너뜀')
}

export { server }
