import { Router } from 'express'
import { getAgentByDid } from '../lib/agent'
import { AtpAgent } from '@atproto/api'

export const meRouter = Router()

meRouter.get('/me', async (req, res) => {
  const did = req.cookies?.did
  if (!did) {
    return res.status(401).json({ error: 'Not logged in' })
  }

  try {
    const result = await getAgentByDid(did)
    if (!result) {
      return res.status(401).json({ error: 'Session expired' })
    }

    const { session, did: userDid } = result
    
    const publicAgent = new AtpAgent({ service: 'https://public.api.bsky.app' })
    const profile = await publicAgent.getProfile({ actor: userDid })
    
    const callbackUrl = `/callback.html?success=true&did=${encodeURIComponent(profile.data.did)}&handle=${encodeURIComponent(profile.data.handle)}`
    res.redirect(callbackUrl)
  } catch (error) {
    console.error('/me 에러:', error)
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류'
    res.redirect(`/callback.html?success=false&error=${encodeURIComponent(errorMsg)}`)
  }
})
