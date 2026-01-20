import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { authRouter } from './routes/auth'
import { meRouter } from './routes/me'

export const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// 모든 요청 로깅
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// 정적 파일 제공 (HTML, CSS, JS 등)
const publicPath = path.join(__dirname, '../public')
console.log('Public 폴더 경로:', publicPath)
app.use(express.static(publicPath))

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html')
  console.log('Index.html 경로:', indexPath)
  console.log('파일 존재 여부 확인 중...')
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('파일 전송 오류:', err)
      res.status(500).send('파일을 찾을 수 없습니다: ' + indexPath)
    } else {
      console.log('Index.html 전송 완료')
    }
  })
})

app.use(authRouter)
app.use(meRouter)
