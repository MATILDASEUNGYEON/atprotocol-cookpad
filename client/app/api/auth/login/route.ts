import { NextRequest, NextResponse } from 'next/server'
import { getOAuthClient } from '@/lib/oauth'

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json()
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'identifier required' },
        { status: 400 }
      )
    }

    const oauthClient = await getOAuthClient()
    const url = await oauthClient.authorize(identifier, {
      scope: 'atproto transition:generic'
    })

    return NextResponse.json({ redirectUrl: url.toString() })
  } catch (error: any) {
    console.error('❌ 로그인 에러:', error)
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
