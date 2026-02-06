import { Jetstream } from '@skyware/jetstream'
import WebSocket from 'ws'
import { db } from '../db/index.js'

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

async function deleteRecipeIndex(uri: string) {
  await db
    .deleteFrom('recipe')
    .where('uri', '=', uri)
    .execute()
}

function getBlobUrl(did: string, cid: string): string {

  return `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${cid}@jpeg`
}
