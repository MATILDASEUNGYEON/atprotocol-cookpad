import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'
import { recipeRouter } from './routes/recipe'
import { WEB_ORIGIN } from './config/env'
export const app = express()

app.use(
  cors({
    origin: WEB_ORIGIN,
    credentials: true,
  }),
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  next()
})

const clientBuildPath = path.join(__dirname, '../client/dist')

app.use(express.static(clientBuildPath))

app.use(recipeRouter)

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})
