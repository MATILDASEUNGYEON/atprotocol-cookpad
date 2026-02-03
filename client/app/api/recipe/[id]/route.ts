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
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: rkey } = params
    const did = req.cookies.get('did')?.value

    if (!did) {
      console.log('❌ Unauthorized: No DID in cookies')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🗑️ Deleting recipe:', { rkey, did })

    console.log('🔐 Restoring OAuth session...')
    const { agent, did: repoDid } = await getSessionAgent(did)

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
    
    if (recipe.author_did !== repoDid) {
      console.log('❌ Forbidden: Not the recipe author')
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own recipes' },
        { status: 403 }
      )
    }

    console.log('🔥 Deleting record from PDS...')
    await agent.com.atproto.repo.deleteRecord({
      repo: repoDid,
      collection: 'com.cookpad.recipe',
      rkey: rkey,
    })

    console.log('✅ Recipe deleted from PDS')
    
    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
      uri: recipe.uri,
    })

  } catch (error) {
    console.error('❌ Recipe delete failed:', error)
    
    if (error instanceof Error) {
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
