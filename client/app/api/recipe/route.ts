import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'

export async function POST(req: NextRequest) {
  const did = req.cookies.get('did')?.value
  if (!did) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { agent, did: repoDid } = await getSessionAgent(did)

  const body = await req.json()

  const record = await agent.com.atproto.repo.createRecord({
    repo: repoDid,
    collection: 'com.cookpad.recipe',
    record: body,
  })
  
  console.log('📦 formData keys:')
for (const key of body.keys()) {
    console.log(' -', key)
}

  return NextResponse.json(record)
}
