import { getTestAgent, createTestRecipe } from "./helpers"

describe('Recipe Value Check', () => {
  const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'

  test('레시피 생성 후 record.value 확인', async () => {
    console.log('🔑 TEST DID:', TEST_DID)

    const { agent, did } = await getTestAgent(TEST_DID)

    const recipeData = createTestRecipe()

    // 1️⃣ 레시피 생성
    const createRes = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: "com.cookpad.recipe",
      record: recipeData,
    })

    console.log('📦 createRecord response:', createRes.data)
    console.log('📝 Recipe URI:', createRes.data.uri)
    console.log('🧬 Recipe CID:', createRes.data.cid)

    // 기본 검증
    expect(createRes.data.uri).toBeDefined()
    expect(createRes.data.cid).toBeDefined()

    // 2️⃣ rkey 추출
    const rkey = createRes.data.uri.split('/').pop()
    expect(rkey).toBeDefined()

    // 3️⃣ 같은 PDS agent로 getRecord 호출
    const recordRes = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: rkey!,
    })

    console.log('📖 getRecord response (full):')
    console.log(JSON.stringify(recordRes.data, null, 2))

    // 4️⃣ record.value 확인
    const value = recordRes.data.value as any

    console.log('🍳 record.value:')
    console.log(JSON.stringify(value, null, 2))

    // value 검증
    expect(value).toBeDefined()
    expect(value.$type).toBe('com.cookpad.recipe')
    expect(value.title).toBe(recipeData.title)
    expect(value.ingredients).toBeInstanceOf(Array)
    expect(value.steps).toBeInstanceOf(Array)
    expect(value.createdAt).toBeDefined()
  })
})
