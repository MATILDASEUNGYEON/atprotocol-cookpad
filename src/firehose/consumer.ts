import { Jetstream } from '@skyware/jetstream'
import WebSocket from 'ws'
import { db } from '../db/index.js'

const JETSTREAM_URL = 'wss://jetstream2.us-east.bsky.network/subscribe'

/**
 * Firehose Consumer
 * 
 * 역할:
 * 1. Jetstream에 연결 (firehose 이벤트 수신)
 * 2. com.cookpad.recipe collection commit 감지
 * 3. AppView DB에 인덱싱
 */
export async function startFirehoseConsumer() {

  const jetstream = new Jetstream({
    ws: WebSocket,
    wantedCollections: ['com.cookpad.recipe'],
  })

  jetstream.onCreate('com.cookpad.recipe', async (event) => {
    try {
      
      const { did, commit } = event
      const record = commit.record as any
      
      await indexRecipe({
        uri: `at://${did}/${commit.collection}/${commit.rkey}`,
        cid: commit.cid,
        author_did: did,
        title: record.title,
        description: record.description,
        servings: record.servings,
        cook_time_minutes: record.cookTimeMinutes,
        thumbnail_url: record.thumbnail ? getBlobUrl(did, record.thumbnail.ref.$link) : undefined,
        tags: JSON.stringify(record.tags || []), 
        visibility: record.visibility || 'published',
        created_at: new Date().toISOString(),
        indexed_at: new Date().toISOString(),
      })

    } catch (error) {
      console.error('❌ Failed to index recipe:', error)
    }
  })

  jetstream.onUpdate('com.cookpad.recipe', async (event) => {
    try {
      
      const { did, commit } = event
      const record = commit.record as any
      
      await updateRecipeIndex({
        uri: `at://${did}/${commit.collection}/${commit.rkey}`,
        cid: commit.cid,
        title: record.title,
        description: record.description,
        servings: record.servings,
        cook_time_minutes: record.cookTimeMinutes,
        thumbnail_url: record.thumbnail ? getBlobUrl(did, record.thumbnail.ref.$link) : undefined,
        tags: JSON.stringify(record.tags || []), 
        visibility: record.visibility || 'published',
      })

    } catch (error) {
      console.error('❌ Failed to update recipe index:', error)
    }
  })

  jetstream.onDelete('com.cookpad.recipe', async (event) => {
    try {
      const { did, commit } = event
      const uri = `at://${did}/${commit.collection}/${commit.rkey}`
      
      
      await deleteRecipeIndex(uri)
      
    } catch (error) {
      console.error('❌ Failed to delete recipe from index:', error)
    }
  })

  jetstream.start()
  console.log('✅ Firehose Consumer started')
}

/**
 * AppView DB에 레시피 인덱싱
 */
async function indexRecipe(recipe: {
  uri: string
  cid: string
  author_did: string
  title: string
  description?: string
  servings?: number
  cook_time_minutes?: number
  thumbnail_url?: string
  tags: string 
  visibility: 'draft' | 'published'
  created_at: string
  indexed_at: string
}) {
  await db
    .insertInto('recipe')
    .values(recipe)
    .execute()
}

/**
 * 레시피 인덱스 업데이트
 */
async function updateRecipeIndex(update: {
  uri: string
  cid: string
  title: string
  description?: string
  servings?: number
  cook_time_minutes?: number
  thumbnail_url?: string
  tags: string 
  visibility: 'draft' | 'published'
}) {
  await db
    .updateTable('recipe')
    .set({
      ...update,
      indexed_at: new Date().toISOString(),
    })
    .where('uri', '=', update.uri)
    .execute()
}

/**
 * 레시피 인덱스 삭제
 */
async function deleteRecipeIndex(uri: string) {
  await db
    .deleteFrom('recipe')
    .where('uri', '=', uri)
    .execute()
}

/**
 * Blob URL 생성
 * PDS에서 이미지를 가져올 수 있는 URL
 */
function getBlobUrl(did: string, cid: string): string {

  return `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${cid}@jpeg`
}
