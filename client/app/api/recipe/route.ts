import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'
import { generateTags } from '@/lib/tags'

export async function POST(req: NextRequest) {
  try {
    const did = req.cookies.get('did')?.value
    if (!did) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agent, did: repoDid } = await getSessionAgent(did)

    const formData = await req.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const serves = parseInt(formData.get('serves') as string)
    const cookTime = formData.get('cookTime') as string
    
    
    const hourMatch = cookTime.match(/(\d+)hr/)
    const minMatch = cookTime.match(/(\d+)mins?/)
    const cookTimeMinutes = (hourMatch ? parseInt(hourMatch[1]) * 60 : 0) + (minMatch ? parseInt(minMatch[1]) : 0)
    
   
    const ingredients = JSON.parse(formData.get('ingredients') as string)
    const tips = formData.get('tips') as string
    const status = formData.get('status') as string
    const steps = JSON.parse(formData.get('steps') as string)

    
    let thumbnailBlob = null
    const thumbnailFile = formData.get('thumbnail') as File | null
    if (thumbnailFile) {
      const thumbnailBytes = await thumbnailFile.arrayBuffer()
      const thumbnailUpload = await agent.uploadBlob(
        new Uint8Array(thumbnailBytes),
        { encoding: thumbnailFile.type }
      )
      thumbnailBlob = thumbnailUpload.data.blob
    }

    const stepsWithBlobs = await Promise.all(
      steps.map(async (step: any) => {
        const stepImageFile = formData.get(`stepImage:${step.id}`) as File | null
        if (!stepImageFile) {
          return { text: step.description, image: undefined }
        }

        const imageBytes = await stepImageFile.arrayBuffer()
        const imageUpload = await agent.uploadBlob(
          new Uint8Array(imageBytes),
          { encoding: stepImageFile.type }
        )
        
        
        return {
          text: step.description,
          image: imageUpload.data.blob
        }
      })
    )
    
    const autoTags = generateTags(
      ingredients.map((ing: any) => ({
        type: ing.section ? 'section' : 'ingredient',
        name: ing.section ? undefined : ing.name,
        title: ing.section || undefined
      })),
      title,
      description
    )
    
    
    const recipeRecord = {
      title,
      description,
      servings: serves,
      cookTimeMinutes,
      ingredients: ingredients.map((ing: any) => ({
        type: ing.section ? 'section' : 'ingredient',
        name: ing.section ? undefined : ing.name,
        title: ing.section || undefined
      })),
      steps: stepsWithBlobs,
      thumbnail: thumbnailBlob,
      tags: autoTags,
      visibility: status === 'published' ? 'published' : 'draft',
      $type: 'com.cookpad.recipe'
    }

    const record = await agent.com.atproto.repo.createRecord({
      repo: repoDid,
      collection: 'com.cookpad.recipe',
      record: recipeRecord,
    })

    return NextResponse.json({
      success: true,
      uri: record.data.uri,
      cid: record.data.cid
    })

  } catch (error) {
    console.error('❌ Recipe upload failed:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/recipe
 * AppView DB에서 레시피 목록 조회
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const author = searchParams.get('author')
    const visibility = searchParams.get('visibility') || 'published'

    const appViewUrl = process.env.NEXT_PUBLIC_APP_VIEW_URL || 'http://localhost:3000'
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      visibility,
      ...(author && { author })
    })

    const response = await fetch(`${appViewUrl}/api/recipes?${queryParams}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes from AppView')
    }

    const recipes = await response.json()
    return NextResponse.json(recipes)

  } catch (error) {
    console.error('❌ Recipe list fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes', details: String(error) },
      { status: 500 }
    )
  }
}
