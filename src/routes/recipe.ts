import { Router } from 'express'
import { db } from '../db/index'

export const recipeRouter = Router()

function formatCookTimeMinutes(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return ''
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  return `${hours > 0 ? `${hours}hr ` : ''}${mins > 0 ? `${mins}mins` : ''}`.trim()
}

/**
 * 레시피 목록 조회 (AppView)
 * GET /api/recipes?visibility=published&limit=20
 */
recipeRouter.get('/api/recipes', async (req, res) => {
  try {
    const visibility = (req.query.visibility as string) || 'published'
    const limit = parseInt(req.query.limit as string) || 20
    const author = req.query.author as string | undefined
    const uri = req.query.uri as string | undefined

    if (uri) {
      const recipe = await db
        .selectFrom('recipe')
        .selectAll()
        .where('uri', '=', decodeURIComponent(uri))
        .executeTakeFirst()

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      const cookTime = formatCookTimeMinutes(recipe.cook_time_minutes as number)

      return res.json({
        ...recipe,
        cook_time_minutes: cookTime,
        tags: JSON.parse(recipe.tags as unknown as string),
      })
    }

    let query = db
      .selectFrom('recipe')
      .selectAll()
      .where('visibility', '=', visibility as any)
      .orderBy('created_at', 'desc')
      .limit(limit)

    if (author) {
      query = query.where('author_did', '=', author)
    }

    const recipes = await query.execute()

    res.json({
      recipes: recipes.map(recipe => {
        const cookTime = formatCookTimeMinutes(recipe.cook_time_minutes as number)
        return {
          ...recipe,
          cook_time_minutes: cookTime,
          tags: JSON.parse(recipe.tags as unknown as string),
        }
      }),
    })
  } catch (error) {
    console.error('❌ Failed to fetch recipes:', error)
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

/**
 * 레시피 상세 조회 by rkey
 * GET /api/recipes/:rkey
 * AppView 메타데이터 + PDS 전체 record 조합
 */
recipeRouter.get('/api/recipes/:rkey', async (req, res) => {
  try {
    const { rkey } = req.params


    const recipeIndex = await db
      .selectFrom('recipe')
      .selectAll()
      .where('uri', 'like', `%/${rkey}`)
      .executeTakeFirst()

    if (!recipeIndex) {
      return res.status(404).json({ error: 'Recipe not found' })
    }

    try {
      const { AtpAgent } = await import('@atproto/api')
      
      const uriParts = recipeIndex.uri.split('/')
      const did = uriParts[2]
      const collection = uriParts[3]


      const agent = new AtpAgent({ service: 'https://bsky.social' })
      
      const recordResponse = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: collection,
        rkey: rkey,
      })

      const record = recordResponse.data.value as any

      let authorProfile = null

      try {
        const profileUrl = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`
        const profileResponse = await fetch(profileUrl)

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()

          const handle = profileData.handle

          const defaultDisplayName =
            handle
              ?.replace(/^@/, '')  
              ?.split('.')[0]     
              ?? 'user'

          authorProfile = {
            handle,
            displayName: profileData.displayName || defaultDisplayName,
            avatar: profileData.avatar || null,
          }

        } else {
          console.error('⚠️ Failed to fetch profile, status:', profileResponse.status)
        }
      } catch (profileError) {
        console.error('⚠️ Failed to fetch author profile:', profileError)
      }

      const stepsWithUrls = (record.steps || []).map((step: any, index: number) => {
        let imageUrl = undefined
        
        if (step.image) {
          let cid = step.image.ref
          
          if (cid) {
            const cidString = typeof cid === 'string' ? cid : cid.toString()
            imageUrl = `https://cdn.bsky.app/img/feed_fullsize/plain/${did}/${cidString}@jpeg`
          } else {
            console.error(`⚠️ Step ${index + 1} has image but no CID found:`, step.image)
          }
        }
        
        return {
          text: step.text,
          description: step.text,
          image: imageUrl
        }
      })


      let thumbnailUrl = recipeIndex.thumbnail_url
      if (!thumbnailUrl && record.thumbnail) {
        let cid = record.thumbnail.ref
        
        if (cid) {
          const cidString = typeof cid === 'string' ? cid : cid.toString()
          thumbnailUrl = `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${cidString}@jpeg`
        }
      }

      const cookTime = formatCookTimeMinutes(recipeIndex.cook_time_minutes as number)

      res.json({
        ...recipeIndex,
        cook_time_minutes: cookTime,
        thumbnail_url: thumbnailUrl,
        tags: JSON.parse(recipeIndex.tags as unknown as string),
        ingredients: record.ingredients || [],
        steps: stepsWithUrls,
        author_profile: authorProfile,
      })
    } catch (pdsError) {
      console.error('⚠️ Failed to fetch from PDS:', pdsError)
      console.error('Error details:', pdsError instanceof Error ? pdsError.message : String(pdsError))

      const cookTime = formatCookTimeMinutes(recipeIndex.cook_time_minutes as number)

      res.json({
        ...recipeIndex,
        cook_time_minutes: cookTime,
        tags: JSON.parse(recipeIndex.tags as unknown as string),
        ingredients: [],
        steps: [],
        author_profile: null,
      })
    }
  } catch (error) {
    console.error('❌ Failed to fetch recipe:', error)
    res.status(500).json({ error: 'Failed to fetch recipe' })
  }
})

/**
 * 내 레시피 목록 조회
 * GET /api/recipes/my
 */
recipeRouter.get('/api/recipes/my', async (req, res) => {
  try {
    const did = req.cookies.did

    if (!did) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const recipes = await db
      .selectFrom('recipe')
      .selectAll()
      .where('author_did', '=', did)
      .orderBy('created_at', 'desc')
      .execute()

    res.json({
      recipes: recipes.map(recipe => ({
        ...recipe,
        cook_time_minutes: formatCookTimeMinutes(recipe.cook_time_minutes as number),
        tags: JSON.parse(recipe.tags as unknown as string),
      })),
    })
  } catch (error) {
    console.error('❌ Failed to fetch my recipes:', error)
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

/**
 * 태그 기반 레시피 검색
 * GET /api/recipes/by-tag/:prefix/:value
 * 예: /api/recipes/by-tag/ingredient/butter
 */
recipeRouter.get('/api/recipes/by-tag/:prefix/:value', async (req, res) => {
  try {
    const { prefix, value } = req.params
    const tag = `${prefix}:${value}`
    const limit = parseInt(req.query.limit as string) || 50

    const recipes = await db
      .selectFrom('recipe')
      .selectAll()
      .where('tags', 'like', `%"${tag}"%`)
      .where('visibility', '=', 'published')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .execute()


    res.json({
      tag,
      count: recipes.length,
      recipes: recipes.map(recipe => {
        const cookTime = formatCookTimeMinutes(recipe.cook_time_minutes as number)
        return {
          ...recipe,
          cook_time_minutes: cookTime,
          tags: JSON.parse(recipe.tags as unknown as string),
        }
      }),
    })
  } catch (error) {
    console.error('❌ Failed to search recipes by tag:', error)
    res.status(500).json({ error: 'Failed to search recipes' })
  }
})
