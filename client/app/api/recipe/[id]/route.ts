import { NextRequest, NextResponse } from 'next/server'

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
