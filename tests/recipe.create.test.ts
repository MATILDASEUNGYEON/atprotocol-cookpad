import { getTestAgent, createTestRecipe } from './helpers'

/**
 * 🧪 Recipe CREATE 단위 테스트
 * 
 * 테스트 목표:
 * - com.cookpad.recipe collection에 레코드 생성
 * - Lexicon 스키마 검증 (자동)
 * - URI 및 CID 생성 확인
 * 
 * 실행 전 필수:
 * 1. OAuth 로그인 완료
 * 2. 아래 DID를 실제 로그인된 DID로 변경
 */

describe('Recipe CRUD - CREATE', () => {
  const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'
  console.log('🔑 테스트에 사용되는 DID:', TEST_DID)
  let recipeUri: string
  let recipeCid: string

  beforeAll(() => {
    if (TEST_DID === 'did:plc:YOUR_DID_HERE') {
      console.warn('⚠️ TEST_DID 환경변수를 설정하세요')
    }
  })

  test('레시피 레코드를 생성할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const recipeData = createTestRecipe()
    
    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })

    expect(res.data.uri).toBeDefined()
    expect(res.data.cid).toBeDefined()
    expect(res.data.uri).toContain('com.cookpad.recipe')
    expect(res.data.uri).toContain(did)

    recipeUri = res.data.uri
    recipeCid = res.data.cid

    console.log('✅ 레시피 생성 성공:', res.data.uri)
  })

  test.skip('필수 필드가 없으면 실패한다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const invalidRecipe = {
     
      ingredients: ['재료'],
      steps: [{ text: '조리' }],
      createdAt: new Date().toISOString(),
    }

    await expect(
      agent.com.atproto.repo.createRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        record: invalidRecipe,
      })
    ).rejects.toThrow()
  })

  test.skip('잘못된 데이터 타입은 실패한다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const invalidRecipe = createTestRecipe({
      cookTimeMinutes: '25분', 
    })

    await expect(
      agent.com.atproto.repo.createRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        record: invalidRecipe,
      })
    ).rejects.toThrow()
  })

  test('최소 레시피 (선택 필드 제외)를 생성할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const minimalRecipe = {
      title: '최소 레시피',
      ingredients: ['재료1'],
      steps: [{ text: '조리 단계' }],
      createdAt: new Date().toISOString(),
    }

    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: minimalRecipe,
    })

    expect(res.data.uri).toBeDefined()
    expect(res.data.cid).toBeDefined()
    
    console.log('✅ 최소 레시피 생성 성공:', res.data.uri)
  })

  test('태그가 포함된 레시피를 생성할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const recipeWithTags = createTestRecipe({
      tags: ['한식', '국물', '얼큰'],
    })

    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeWithTags,
    })

    expect(res.data.uri).toBeDefined()
    
    console.log('✅ 태그 포함 레시피 생성 성공:', res.data.uri)
  })
})
