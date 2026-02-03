import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'

export async function POST(req: NextRequest) {
  try {
    const did = req.cookies.get('did')?.value
    if (!did) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, bio } = await req.json()

    console.log('📝 프로필 업데이트 시작 for DID:', did)

    const { agent } = await getSessionAgent(did)

    // 기존 프로필 가져오기
    let existingRecord: any = {}
    try {
      const { data } = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'app.bsky.actor.profile',
        rkey: 'self',
      })
      existingRecord = data.value
      console.log('📖 기존 프로필:', JSON.stringify(existingRecord, null, 2))
    } catch (err) {
      console.log('⚠️ 기존 프로필 없음, 새로 생성')
    }

    // 기존 프로필과 병합하여 업데이트
    const updatedRecord = {
      ...existingRecord,
      $type: 'app.bsky.actor.profile',
      displayName: name,
      description: bio,
    }
    
    console.log('💾 업데이트할 프로필:', JSON.stringify(updatedRecord, null, 2))

    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
      record: updatedRecord,
    })

    console.log('✅ 프로필 업데이트 성공')
    
    // 업데이트 후 프로필 확인
    try {
      const verifyProfile = await agent.getProfile({ actor: did })
      console.log('🔍 업데이트 후 프로필 확인:', {
        displayName: verifyProfile.data.displayName,
        description: verifyProfile.data.description,
      })
    } catch (err) {
      console.log('⚠️ 프로필 확인 실패:', err)
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('❌ 프로필 업데이트 실패:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
