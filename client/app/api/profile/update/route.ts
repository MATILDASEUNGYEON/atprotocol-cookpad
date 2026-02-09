import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'

export async function POST(req: NextRequest) {
  try {
    const did = req.cookies.get('did')?.value
    if (!did) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, bio } = await req.json()

    const { agent } = await getSessionAgent(did)

    let existingRecord: any = {}
    try {
      const { data } = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'app.bsky.actor.profile',
        rkey: 'self',
      })
      existingRecord = data.value
    } catch (err) {
      console.error('⚠️ 기존 프로필 없음, 새로 생성')
    }

    const updatedRecord = {
      ...existingRecord,
      $type: 'app.bsky.actor.profile',
      displayName: name,
      description: bio,
    }
  

    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
      record: updatedRecord,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('❌ 프로필 업데이트 실패:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
