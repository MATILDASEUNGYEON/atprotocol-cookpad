import { NextRequest, NextResponse } from 'next/server'
import { getOAuthClient } from '@/lib/oauth'
import { AtpAgent } from '@atproto/api'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    console.log('📞 OAuth callback 수신:', searchParams.toString())

    const oauthClient = await getOAuthClient()
    const { session } = await oauthClient.callback(searchParams)

    console.log('✅ 세션 생성 완료:', session.did)

    const publicAgent = new AtpAgent({ service: 'https://public.api.bsky.app' })
    const profile = await publicAgent.getProfile({ actor: session.did })

    const homeUrl = new URL('/', req.nextUrl.origin)
    homeUrl.searchParams.set('login', 'success')
    homeUrl.searchParams.set('handle', profile.data.handle)
    homeUrl.searchParams.set('did', session.did)
    if (profile.data.displayName) {
      homeUrl.searchParams.set('displayName', profile.data.displayName)
    }
    if (profile.data.avatar) {
      homeUrl.searchParams.set('avatar', profile.data.avatar)
    }

    const response = NextResponse.redirect(homeUrl)
    
    response.cookies.set('did', session.did, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30일
    })
    
    response.cookies.set('handle', profile.data.handle, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    console.log('✅ 로그인 성공, 홈으로 리다이렉트:', profile.data.handle)

    return response
  } catch (error: any) {
    console.error('❌ OAuth callback 에러:', error)

    const errorUrl = new URL('/callback/error', req.nextUrl.origin)
    errorUrl.searchParams.set('error', encodeURIComponent(error.message))
    
    return NextResponse.redirect(errorUrl)
  }
}
