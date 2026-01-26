import 'dotenv/config'

const HOST = process.env.HOST ?? '127.0.0.1'
const PORT = process.env.PORT ?? '3000'

export const SERVER_ORIGIN = `http://${HOST}:${PORT}`

export const OAUTH = {
  CLIENT_ID: process.env.OAUTH_CLIENT_ID ?? 'http://localhost',
  REDIRECT_PATH: process.env.OAUTH_REDIRECT_PATH ?? '/oauth/callback',
  SCOPE: process.env.OAUTH_SCOPE ?? 'atproto transition:generic',
}

export const OAUTH_REDIRECT_URI = `${SERVER_ORIGIN}${OAUTH.REDIRECT_PATH}`

export const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:0000'