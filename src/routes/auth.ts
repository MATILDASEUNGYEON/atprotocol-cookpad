import { Router } from 'express'
import { oauthClient } from '../auth/oauthClient'
import { OAUTH } from '../config/env'

export const authRouter = Router()

authRouter.get('/login', async (req, res) => {
  const url = await oauthClient.authorize('bsky.social', {
    scope: OAUTH.SCOPE
  })

  res.redirect(url.toString())
})

authRouter.post('/login', async (req, res) => {
  const { identifier } = req.body
  if (!identifier) {
    return res.status(400).json({ error: 'identifier required' })
  }

  const url = await oauthClient.authorize(identifier, {
    scope: OAUTH.SCOPE
  })

  res.json({ redirectUrl: url.toString() })
})

authRouter.get('/oauth/callback', async (req, res) => {
  const params = new URLSearchParams(req.originalUrl.split('?')[1])

  const oauth = await oauthClient.callback(params)

  res.cookie('did', oauth.session.did, {
    httpOnly: true,
  })

  res.redirect('/me')
})
