import { NextRequest, NextResponse } from 'next/server'
import { getSessionAgent } from '@/lib/agent'
import { generateTags } from '@/lib/tags'

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
 * PUT /api/recipe/[id]
 * ATProtocol 기반 레시피 수정
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: rkey } = params
    const did = req.cookies.get('did')?.value

    if (!did) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    
    const body = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      cook_time_minutes: parseInt(formData.get('cook_time_minutes') as string),
      servings: parseInt(formData.get('servings') as string),
      ingredients: JSON.parse(formData.get('ingredients') as string),
      steps: JSON.parse(formData.get('steps') as string),
      thumbnail_url: formData.get('thumbnail_url') as string
    }

    const { agent, did: repoDid } = await getSessionAgent(did)

    const appViewUrl =
      process.env.NEXT_PUBLIC_APP_VIEW_URL || 'http://localhost:3000'

    const checkResponse = await fetch(
      `${appViewUrl}/api/recipes/${rkey}`
    )

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
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own recipes' },
        { status: 403 }
      )
    }

    const ingredientsForPDS = (body.ingredients || []).map((ing: any) => {
      if (ing.type === 'section') {
        return {
          type: 'section',
          title: ing.title
        }
      } else {
        return {
          type: 'ingredient',
          name: ing.name
        }
      }
    })

    const stepsForPDS = await Promise.all((body.steps || []).map(async (step: any) => {
      let imageBlob = undefined
      
      const stepImageFile = formData.get(`stepImage:${step.id}`) as File | null
      
      if (stepImageFile) {
        const imageBytes = await stepImageFile.arrayBuffer()
        const imageUpload = await agent.uploadBlob(
          new Uint8Array(imageBytes),
          { encoding: stepImageFile.type }
        )
        imageBlob = imageUpload.data.blob
      } else if (step.existingImageUrl) {
        if (step.existingImageUrl.includes('cdn.bsky.app')) {
          const match = step.existingImageUrl.match(/plain\/[^/]+\/([^@]+)/)
          if (match) {
            imageBlob = {
              $type: 'blob',
              ref: { $link: match[1] },
              mimeType: 'image/jpeg',
              size: 0
            }
          }
        }
      }

      return {
        text: step.text,
        image: imageBlob
      }
    }))

    const newTags = generateTags(
      ingredientsForPDS,
      body.title,
      body.description
    )

    const existingTags = recipe.tags || []
    const mergedTags = [...new Set([...existingTags, ...newTags])]

    await agent.com.atproto.repo.putRecord({
      repo: repoDid,
      collection: 'com.cookpad.recipe',
      rkey,
      record: {
        $type: 'com.cookpad.recipe',

        title: body.title,
        description: body.description,
        ingredients: ingredientsForPDS,
        steps: stepsForPDS,
        cookTimeMinutes: body.cook_time_minutes,
        servings: body.servings,
        thumbnail: body.thumbnail_url ? undefined : null,
        tags: mergedTags,

        createdAt: recipe.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })


    return NextResponse.json({
      success: true,
      message: 'Recipe updated successfully',
    })

  } catch (error) {
    console.error('❌ Recipe update failed:', error)

    return NextResponse.json(
      { error: 'Failed to update recipe', details: String(error) },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { agent, did: repoDid } = await getSessionAgent(did)

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
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own recipes' },
        { status: 403 }
      )
    }

    await agent.com.atproto.repo.deleteRecord({
      repo: repoDid,
      collection: 'com.cookpad.recipe',
      rkey: rkey,
    })

    
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
