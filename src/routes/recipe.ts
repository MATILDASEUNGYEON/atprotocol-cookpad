import { Router } from 'express'
import { db } from '../db/index'

export const recipeRouter = Router()

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

      return res.json({
        ...recipe,
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
      recipes: recipes.map(recipe => ({
        ...recipe,
        tags: JSON.parse(recipe.tags as unknown as string),
      })),
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

    console.log('🔍 Fetching recipe by rkey:', rkey)

    // 1. AppView DB에서 메타데이터 조회
    const recipeIndex = await db
      .selectFrom('recipe')
      .selectAll()
      .where('uri', 'like', `%/${rkey}`)
      .executeTakeFirst()

    if (!recipeIndex) {
      console.log('❌ Recipe not found:', rkey)
      return res.status(404).json({ error: 'Recipe not found' })
    }

    console.log('✅ Recipe index found:', recipeIndex.title)

    // 2. PDS에서 실제 record 가져오기
    console.log('🔄 Attempting to fetch from PDS...')
    try {
      const { AtpAgent } = await import('@atproto/api')
      
      // URI 파싱: at://did/collection/rkey
      const uriParts = recipeIndex.uri.split('/')
      const did = uriParts[2]
      const collection = uriParts[3]

      console.log('📍 PDS request:', { did, collection, rkey })

      // Public PDS endpoint로 record 조회 (인증 불필요)
      const agent = new AtpAgent({ service: 'https://bsky.social' })
      
      const recordResponse = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: collection,
        rkey: rkey,
      })

      console.log('✅ PDS response received')
      const record = recordResponse.data.value as any

      console.log('✅ Full record fetched from PDS')
      console.log('📦 Raw steps from PDS:', JSON.stringify(record.steps?.[0], null, 2))

      // Steps의 image blob을 URL로 변환
      const stepsWithUrls = (record.steps || []).map((step: any, index: number) => {
        let imageUrl = undefined
        
        if (step.image) {
          // step.image가 BlobRef 객체인 경우
          // step.image.ref가 CID 객체이므로 직접 toString() 호출
          let cid = step.image.ref
          
          if (cid) {
            // CID 객체를 문자열로 변환
            const cidString = typeof cid === 'string' ? cid : cid.toString()
            imageUrl = `https://cdn.bsky.app/img/feed_fullsize/plain/${did}/${cidString}@jpeg`
            console.log(`🖼️ Step ${index + 1} image converted: ${imageUrl}`)
          } else {
            console.log(`⚠️ Step ${index + 1} has image but no CID found:`, step.image)
          }
        }
        
        return {
          text: step.text,
          description: step.text,
          image: imageUrl
        }
      })

      console.log('📤 Sending steps:', JSON.stringify(stepsWithUrls[0], null, 2))

      // Thumbnail URL도 blob reference에서 변환
      let thumbnailUrl = recipeIndex.thumbnail_url
      if (!thumbnailUrl && record.thumbnail) {
        let cid = record.thumbnail.ref
        
        if (cid) {
          const cidString = typeof cid === 'string' ? cid : cid.toString()
          thumbnailUrl = `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${cidString}@jpeg`
        }
      }

      // 3. AppView 메타데이터 + PDS record 조합
      res.json({
        ...recipeIndex,
        thumbnail_url: thumbnailUrl,
        tags: JSON.parse(recipeIndex.tags as unknown as string),
        ingredients: record.ingredients || [],
        steps: stepsWithUrls,
      })
    } catch (pdsError) {
      console.error('⚠️ Failed to fetch from PDS:', pdsError)
      console.error('Error details:', pdsError instanceof Error ? pdsError.message : String(pdsError))
      // PDS 조회 실패 시 AppView 데이터만 반환
      res.json({
        ...recipeIndex,
        tags: JSON.parse(recipeIndex.tags as unknown as string),
        ingredients: [],
        steps: [],
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
        tags: JSON.parse(recipe.tags as unknown as string),
      })),
    })
  } catch (error) {
    console.error('❌ Failed to fetch my recipes:', error)
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})
