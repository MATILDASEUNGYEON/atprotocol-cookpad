import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'

export async function GET(req: NextRequest) {
  try {
    const did = req.cookies.get('did')?.value
    if (!did) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agent } = await getSessionAgent(did)

    const profile = await agent.getProfile({ actor: did })

    return NextResponse.json({
      did: profile.data.did,
      handle: profile.data.handle,
      displayName: profile.data.displayName,
      description: profile.data.description,
      avatar: profile.data.avatar,
      banner: profile.data.banner,
    })
  } catch (error: any) {
    console.error('❌ 프로필 조회 실패:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
