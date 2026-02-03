import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'

export async function GET(req: NextRequest) {
  try {
    const did = req.cookies.get('did')?.value
    if (!did) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('👤 내 프로필 조회 시작 for DID:', did)

    const { agent } = await getSessionAgent(did)

    // 본인의 프로필 정보 가져오기
    const profile = await agent.getProfile({ actor: did })

    console.log('✅ 프로필 조회 성공:', {
      handle: profile.data.handle,
      displayName: profile.data.displayName,
      description: profile.data.description,
    })

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
