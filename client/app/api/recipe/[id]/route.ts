import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'

/**
 * GET /api/recipe/[id]
 * 특정 레시피 상세 조회 (AppView DB에서)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // AppView 서버에 요청
    const appViewUrl = process.env.NEXT_PUBLIC_APP_VIEW_URL || 'http://localhost:3000'
    const response = await fetch(`${appViewUrl}/api/recipes/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        )
      }
      throw new Error('Failed to fetch recipe from AppView')
    }

    const recipe = await response.json()
    return NextResponse.json(recipe)

  } catch (error) {
    console.error('❌ Recipe fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/recipe/[id]
 * ATProtocol 기반 레시피 삭제
 * 
 * 프로세스:
 * 1. 사용자 인증 확인 (OAuth 세션)
 * 2. AppView에서 레시피 조회 (권한 확인용)
 * 3. PDS에서 실제 레코드 삭제 (com.atproto.repo.deleteRecord)
 * 4. Firehose를 통해 자동으로 AppView에서 삭제됨
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: rkey } = params
    const did = req.cookies.get('did')?.value

    // 1. 사용자 인증 확인
    if (!did) {
      console.log('❌ Unauthorized: No DID in cookies')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🗑️ Deleting recipe:', { rkey, did })

    // 2. OAuth 세션으로 Agent 생성
    console.log('🔐 Restoring OAuth session...')
    const { agent, did: repoDid } = await getSessionAgent(did)

    // 3. AppView에서 레시피 조회 (존재 확인 및 권한 확인)
    console.log('🔍 Checking recipe existence...')
    const appViewUrl = process.env.NEXT_PUBLIC_APP_VIEW_URL || 'http://localhost:3000'
    const checkResponse = await fetch(`${appViewUrl}/api/recipes/${rkey}`)
    
    if (!checkResponse.ok) {
      if (checkResponse.status === 404) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        )
      }
      throw new Error('Failed to check recipe')
    }

    const recipe = await checkResponse.json()
    
    // 작성자 권한 확인
    if (recipe.author_did !== repoDid) {
      console.log('❌ Forbidden: Not the recipe author')
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own recipes' },
        { status: 403 }
      )
    }

    // 4. PDS에서 레코드 삭제 (ATProtocol 방식)
    console.log('🔥 Deleting record from PDS...')
    await agent.com.atproto.repo.deleteRecord({
      repo: repoDid,
      collection: 'com.cookpad.recipe',
      rkey: rkey,
    })

    console.log('✅ Recipe deleted from PDS')
    
    // 5. Firehose를 통해 자동으로 AppView DB에서도 삭제됨
    // → PDS가 delete commit event 발행
    // → Jetstream이 수신
    // → AppView consumer의 onDelete 핸들러가 처리

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
      uri: recipe.uri,
    })

  } catch (error) {
    console.error('❌ Recipe delete failed:', error)
    
    // 에러 타입별 처리
    if (error instanceof Error) {
      // ATProtocol 에러 처리
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Recipe not found on PDS' },
          { status: 404 }
        )
      }
      if (error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete recipe', details: String(error) },
      { status: 500 }
    )
  }
}
