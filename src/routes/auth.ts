import { Router } from 'express'
import { oauthClient } from '../auth/oauthClient'
import { OAUTH, WEB_ORIGIN } from '../config/env'
import { AtpAgent } from '@atproto/api'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { identifier } = req.body
  if (!identifier) {
    return res.status(400).json({ error: 'identifier required' })
  }
  console.log('로그인 시도 identifier:', identifier)
  const url = await oauthClient.authorize(identifier, {
    scope: OAUTH.SCOPE
  })

  res.json({ redirectUrl: url.toString() })
})

authRouter.get('/oauth/callback', async (req, res) => {
  try {
    const params = new URLSearchParams(req.originalUrl.split('?')[1])

    const oauth = await oauthClient.callback(params)

    res.cookie('did', oauth.session.did, {
      httpOnly: true,
    })

    const publicAgent = new AtpAgent({ service: 'https://public.api.bsky.app' })
    const profile = await publicAgent.getProfile({ actor: oauth.session.did })

    const callbackUrl = new URL('/callback', WEB_ORIGIN)
    callbackUrl.searchParams.set('success', 'true')
    callbackUrl.searchParams.set('did', oauth.session.did)
    callbackUrl.searchParams.set('handle', profile.data.handle)
    
    res.redirect(callbackUrl.toString())
  } catch (error: any) {
    console.error('OAuth 콜백 에러:', error)

    const callbackUrl = new URL('/callback', WEB_ORIGIN)
    callbackUrl.searchParams.set('error', encodeURIComponent(error.message))
    
    res.redirect(callbackUrl.toString())
  }
})
