import { app } from './app'
import { SERVER_ORIGIN } from './config/env'
import { initializeDb, migrateToLatest } from './db'
import { startFirehoseConsumer } from './firehose/consumer'

// db 초기화 (전역 db 인스턴스에 할당)
const db = initializeDb('./data.db')

const PORT = parseInt(process.env.PORT ?? '3000')

migrateToLatest(db)
  .then(() => {
    console.log('✅ DB 마이그레이션 완료')
    
    // Firehose consumer 시작
    startFirehoseConsumer().catch((err) => {
      console.error('❌ Firehose consumer 시작 실패:', err)
    })
  })
  .catch((err) => {
    console.error('❌ DB 마이그레이션 실패:', err)
    process.exit(1)
  })

let server: any

// import로 실행되는 경우 서버를 시작하지 않음
if (require.main === module) {
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
}

export { server }
