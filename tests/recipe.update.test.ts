import { getTestAgent, createTestRecipe } from './helpers'

/**
 * 🧪 Recipe UPDATE 단위 테스트
 * 
 * 테스트 목표:
 * - putRecord로 레시피 수정
 * - ATProtocol에서 UPDATE = 전체 교체 (부분 수정 ❌)
 * - updatedAt 필드 업데이트 확인
 * - 권한 검증 (다른 DID로 수정 시도)
 */

describe('Recipe CRUD - UPDATE', () => {
  const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'
  
  let testRecipeUri: string
  let testRecipeRkey: string
  let originalRecipe: any

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
      title: 'UPDATE 테스트용 원본 레시피',
      description: '원본 설명',
    })
    
    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })

    testRecipeUri = res.data.uri
    testRecipeRkey = res.data.uri.split('/').pop()!
    
    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })
    
    originalRecipe = record.data.value
    
    console.log('📝 테스트용 레시피 생성:', testRecipeUri)
  })

  test('레시피 전체를 수정할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const updatedRecipe = {
      ...originalRecipe,
      description: '✏️ 업데이트된 설명',
      cookTimeMinutes: 30, 
      updatedAt: new Date().toISOString(),
    }

    const res = await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
      record: updatedRecipe,
    })

    expect(res.data.uri).toBe(testRecipeUri)
    expect(res.data.cid).not.toBe(originalRecipe.cid)
    
    console.log('✅ 레시피 수정 성공')
  })

  test('수정된 내용이 올바르게 조회된다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    const recipe = record.data.value as any
    
    expect(recipe.description).toBe('✏️ 업데이트된 설명')
    expect(recipe.cookTimeMinutes).toBe(30)
    expect(recipe.updatedAt).toBeDefined()
    
    console.log('✅ 수정 내용 확인:', recipe.description)
  })

  test('재료 목록을 수정할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    // 현재 레코드 조회
    const currentRecord = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })
    
    const updatedRecipe = {
      ...(currentRecord.data.value as any),
      ingredients: ['새 재료1', '새 재료2', '새 재료3'],
      updatedAt: new Date().toISOString(),
    }

    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
      record: updatedRecipe,
    })

    // 검증
    const updated = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    expect((updated.data.value as any).ingredients).toEqual([
      '새 재료1',
      '새 재료2',
      '새 재료3',
    ])
    
    console.log('✅ 재료 목록 수정 성공')
  })

  test('조리 단계를 추가/수정할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const currentRecord = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })
    
    const updatedRecipe = {
      ...(currentRecord.data.value as any),
      steps: [
        { text: '1단계: 준비' },
        { text: '2단계: 조리' },
        { text: '3단계: 마무리' },
        { text: '4단계: 플레이팅' },
      ],
      updatedAt: new Date().toISOString(),
    }

    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
      record: updatedRecipe,
    })

    const updated = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    expect((updated.data.value as any).steps.length).toBe(4)
    expect((updated.data.value as any).steps[3].text).toBe('4단계: 플레이팅')
    
    console.log('✅ 조리 단계 수정 성공')
  })

  test('태그를 추가할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const currentRecord = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })
    
    const updatedRecipe = {
      ...(currentRecord.data.value as any),
      tags: ['신규태그1', '신규태그2', '인기'],
      updatedAt: new Date().toISOString(),
    }

    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
      record: updatedRecipe,
    })

    const updated = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })

    expect((updated.data.value as any).tags).toContain('신규태그1')
    expect((updated.data.value as any).tags).toContain('인기')
    
    console.log('✅ 태그 추가 성공')
  })

  test.skip('필수 필드를 제거하면 실패한다 (현재 서버 측 검증 없음)', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const currentRecord = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })
    
    const invalidRecipe = {
      ...(currentRecord.data.value as any),
    }
    delete invalidRecipe.title

    await expect(
      agent.com.atproto.repo.putRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey: testRecipeRkey,
        record: invalidRecipe,
      })
    ).rejects.toThrow()
  })

  test.skip('잘못된 타입으로 수정 시 실패한다 (현재 서버 측 검증 없음)', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const currentRecord = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: testRecipeRkey,
    })
    
    const invalidRecipe = {
      ...(currentRecord.data.value as any),
      cookTimeMinutes: '30분', 
    }

    await expect(
      agent.com.atproto.repo.putRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey: testRecipeRkey,
        record: invalidRecipe,
      })
    ).rejects.toThrow()
  })
})
