import { getTestAgent, createTestRecipe } from './helpers'

/**
 * 🧪 Recipe CRUD 통합 테스트
 * 
 * 전체 CRUD 플로우를 하나의 시나리오로 테스트
 */

describe('Recipe CRUD - 통합 시나리오', () => {
  const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'
  
  test('레시피 생성 → 조회 → 수정 → 삭제 전체 플로우', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    console.log('\n🔄 CRUD 통합 테스트 시작')
    console.log(`📝 DID: ${did}`)
    
    console.log('\n1️⃣ CREATE: 레시피 생성 중...')
    const recipeData = createTestRecipe({
      title: '통합테스트 김치찌개',
      description: '맛있는 김치찌개 레시피',
      ingredients: ['김치', '돼지고기', '두부', '대파'],
      steps: [
        { text: '김치를 먹기 좋게 자른다' },
        { text: '돼지고기를 볶는다' },
        { text: '물을 붓고 끓인다' },
      ],
      cookTimeMinutes: 30,
      servings: 2,
      tags: ['한식', '찌개', '김치'],
    })
    
    const created = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })
    
    const uri = created.data.uri
    const rkey = uri.split('/').pop()!
    
    console.log(`   ✅ 생성 성공: ${uri}`)
    console.log(`   📍 rkey: ${rkey}`)
    console.log(`   🔑 cid: ${created.data.cid}`)
    
    console.log('\n2️⃣ READ: 레시피 조회 중...')
    const read1 = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    const recipe = read1.data.value as any
    console.log(`   ✅ 조회 성공: "${recipe.title}"`)
    console.log(`   📊 재료 ${recipe.ingredients.length}개`)
    console.log(`   📋 조리 단계 ${recipe.steps.length}개`)
    console.log(`   ⏱️  조리 시간: ${recipe.cookTimeMinutes}분`)
    console.log(`   🏷️  태그: ${recipe.tags?.join(', ')}`)
    
    expect(recipe.title).toBe('통합테스트 김치찌개')
    expect(recipe.ingredients.length).toBe(4)
    expect(recipe.steps.length).toBe(3)
    
    console.log('\n3️⃣ UPDATE: 레시피 수정 중...')
    const updatedRecipe = {
      ...recipe,
      description: '✏️ 더 맛있는 김치찌개 레시피',
      cookTimeMinutes: 35,
      ingredients: [...recipe.ingredients, '고춧가루'],
      steps: [
        ...recipe.steps,
        { text: '마지막에 대파를 넣는다' }, 
      ],
      updatedAt: new Date().toISOString(),
    }
    
    const updated = await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
      record: updatedRecipe,
    })
    
    console.log(`   ✅ 수정 성공`)
    console.log(`   🔄 CID 변경: ${created.data.cid} → ${updated.data.cid}`)
    
    const read2 = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    const modifiedRecipe = read2.data.value as any
    console.log(`   📊 재료 ${modifiedRecipe.ingredients.length}개 (4→5)`)
    console.log(`   📋 조리 단계 ${modifiedRecipe.steps.length}개 (3→4)`)
    console.log(`   ⏱️  조리 시간: ${modifiedRecipe.cookTimeMinutes}분 (30→35)`)
    
    expect(modifiedRecipe.ingredients.length).toBe(5)
    expect(modifiedRecipe.steps.length).toBe(4)
    expect(modifiedRecipe.cookTimeMinutes).toBe(35)
    expect(modifiedRecipe.description).toContain('더 맛있는')
    
    console.log('\n4️⃣ DELETE: 레시피 삭제 중...')
    await agent.com.atproto.repo.deleteRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    console.log(`   ✅ 삭제 성공`)
    
    await expect(
      agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey,
      })
    ).rejects.toThrow()
    
    console.log(`   ✅ 삭제 후 조회 불가 확인`)
    console.log('\n✨ 전체 CRUD 플로우 성공!\n')
  }, 30000) 

  test('여러 레시피를 생성하고 목록 조회하기', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    console.log('\n📚 여러 레시피 테스트 시작')
    
    const recipes = [
      { title: '된장찌개', tags: ['한식', '찌개'] },
      { title: '카레라이스', tags: ['일식', '카레'] },
      { title: '토마토 파스타', tags: ['양식', '파스타'] },
    ]
    
    console.log(`\n생성 중: ${recipes.map(r => r.title).join(', ')}`)
    
    const created = await Promise.all(
      recipes.map(r =>
        agent.com.atproto.repo.createRecord({
          repo: did,
          collection: 'com.cookpad.recipe',
          record: createTestRecipe(r),
        })
      )
    )
    
    console.log(`✅ ${created.length}개 레시피 생성 완료`)
    
    const list = await agent.com.atproto.repo.listRecords({
      repo: did,
      collection: 'com.cookpad.recipe',
      limit: 10,
    })
    
    console.log(`\n📋 총 ${list.data.records.length}개 레시피 조회됨:`)
    list.data.records.forEach((record: any) => {
      console.log(`   - ${record.value.title}`)
    })
    
    expect(list.data.records.length).toBeGreaterThanOrEqual(3)
    
    console.log('\n🗑️  생성한 레시피 정리 중...')
    await Promise.all(
      created.map(c =>
        agent.com.atproto.repo.deleteRecord({
          repo: did,
          collection: 'com.cookpad.recipe',
          rkey: c.data.uri.split('/').pop()!,
        })
      )
    )
    
    console.log('✅ 정리 완료\n')
  }, 30000)
})
