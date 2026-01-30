import { NextRequest, NextResponse } from 'next/server'

const APPVIEW_API = process.env.NEXT_PUBLIC_APPVIEW_URL || 'http://localhost:3000'

/**
 * 레시피 목록 조회 (AppView에서)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const authorDid = searchParams.get('author')
    const limit = searchParams.get('limit') || '20'
    
    let url = `${APPVIEW_API}/api/recipes?limit=${limit}`
    if (authorDid) {
      url += `&author=${authorDid}`
    }

    console.log('🔍 Fetching from AppView:', url)

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('❌ AppView response not ok:', response.status, response.statusText)
      throw new Error('Failed to fetch recipes')
    }

    const data = await response.json()
    console.log('✅ Recipes fetched:', data.recipes?.length || 0)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Failed to fetch recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes', recipes: [] },
      { status: 500 }
    )
  }
}
