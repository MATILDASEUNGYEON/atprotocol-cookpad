import { getTestAgent, createTestRecipe } from './helpers'

/**
 * 🧪 Recipe READ unit tests
 *
 * Test goals:
 * - Fetch a recipe record by URI
 * - Verify returned data matches the Lexicon schema
 * - Handle non-existent records correctly
 */

describe('Recipe CRUD - READ', () => {
  const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'

  let testRecipeUri: string
  let testRecipeRkey: string

  beforeAll(async () => {
    if (!TEST_DID.startsWith('did:plc:') || TEST_DID.length < 18) {
      throw new Error(
        `❌ Invalid TEST_DID: "${TEST_DID}"\n` +
        `   DID must start with "did:plc:" followed by a valid identifier\n` +
        `   Example: did:plc:yola3ih3wdsyjzs22xi7wheb\n\n` +
        `   Set TEST_DID environment variable:\n` +
        `   PowerShell: $env:TEST_DID="did:plc:your_actual_did"`
      )
    }

    const { agent, did } = await getTestAgent(TEST_DID)

    const recipeData = createTestRecipe({
      title: 'Recipe for READ test',
    })

    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })

    testRecipeUri = res.data.uri
    testRecipeRkey = res.data.uri.split('/').pop()!

    console.log('📝 Test recipe created:', testRecipeUri)
  })

  test('can fetch a recipe by URI', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)

    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    expect(record.data.uri).toBe(testRecipeUri)
    expect(record.data.value).toBeDefined()

    const recipe = record.data.value as any
    expect(recipe.title).toBe('Recipe for READ test')
    expect(recipe.ingredients).toBeInstanceOf(Array)
    expect(recipe.steps).toBeInstanceOf(Array)
    expect(recipe.createdAt).toBeDefined()

    console.log('✅ Recipe fetch succeeded:', recipe.title)
  })

  test('returns all recipe fields correctly', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)

    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    const recipe = record.data.value as any

    expect(recipe.title).toBeTruthy()
    expect(recipe.ingredients.length).toBeGreaterThan(0)
    expect(recipe.steps.length).toBeGreaterThan(0)
    expect(recipe.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)

    if (recipe.description) {
      expect(typeof recipe.description).toBe('string')
    }
    if (recipe.cookTimeMinutes) {
      expect(typeof recipe.cookTimeMinutes).toBe('number')
    }
    if (recipe.tags) {
      expect(recipe.tags).toBeInstanceOf(Array)
    }
  })

  test('each cooking step has a valid structure', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)

    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    const recipe = record.data.value as any

    recipe.steps.forEach((step: any) => {
      expect(step.text).toBeDefined()
      expect(typeof step.text).toBe('string')
      expect(step.text.length).toBeGreaterThan(0)
    })

    console.log(`✅ Verified ${recipe.steps.length} cooking steps`)
  })

  test('throws an error when the record does not exist', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)

    await expect(
      agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey: 'nonexistent123456',
      })
    ).rejects.toThrow()
  })

  test('fails when trying to read another user’s DID (permission test)', async () => {
    const { agent } = await getTestAgent(TEST_DID)

    const otherUserDid = 'did:plc:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

    await expect(
      agent.com.atproto.repo.getRecord({
        repo: otherUserDid,
        collection: 'com.cookpad.recipe',
        rkey: testRecipeRkey,
      })
    ).rejects.toThrow()
  })

  test('can list multiple recipes using listRecords', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)

    const records = await agent.com.atproto.repo.listRecords({
      repo: did,
      collection: 'com.cookpad.recipe',
      limit: 10,
    })

    expect(records.data.records).toBeInstanceOf(Array)
    expect(records.data.records.length).toBeGreaterThan(0)

    console.log(
      `✅ Successfully fetched ${records.data.records.length} recipe records`,
    )

    records.data.records.forEach((record: any) => {
      expect(record.uri).toBeDefined()
      const recipe = record.value
      expect(recipe).toBeDefined()
      if (recipe.title) {
        expect(typeof recipe.title).toBe('string')
      }
    })
  })
})
