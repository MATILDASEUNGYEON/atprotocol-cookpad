import { getTestAgent, createTestRecipe } from './helpers'

/**
 * 🧪 Recipe DELETE 단위 테스트
 * 
 * 테스트 목표:
 * - deleteRecord로 레시피 삭제
 * - 삭제 후 조회 시 에러 확인
 * - 권한 검증
 * - 존재하지 않는 레코드 삭제 처리
 */

describe('Recipe CRUD - DELETE', () => {
  const TEST_DID = process.env.TEST_DID || 'did:plc:YOUR_DID_HERE'
  
  test('레시피를 삭제할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const recipeData = createTestRecipe({
      title: 'DELETE 테스트용 레시피',
    })
    
    const created = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })

    const rkey = created.data.uri.split('/').pop()!
    
    await agent.com.atproto.repo.deleteRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    console.log('✅ 레시피 삭제 성공:', created.data.uri)
  })

  test('삭제된 레시피는 조회할 수 없다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const recipeData = createTestRecipe({
      title: '삭제 후 조회 테스트',
    })
    
    const created = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })

    const rkey = created.data.uri.split('/').pop()!
    
    await agent.com.atproto.repo.deleteRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    await expect(
      agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey,
      })
    ).rejects.toThrow()
    
    console.log('✅ 삭제 후 조회 실패 확인')
  })

  test.skip('존재하지 않는 레시피 삭제 시도 (PDS가 에러를 반환하지 않음)', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    await expect(
      agent.com.atproto.repo.deleteRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey: 'nonexistent999999',
      })
    ).rejects.toThrow()
  })

  test.skip('이미 삭제된 레시피를 다시 삭제 시도 (PDS가 에러를 반환하지 않음)', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const recipeData = createTestRecipe({
      title: '중복 삭제 테스트',
    })
    
    const created = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      record: recipeData,
    })

    const rkey = created.data.uri.split('/').pop()!
    
    await agent.com.atproto.repo.deleteRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    await expect(
      agent.com.atproto.repo.deleteRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey,
      })
    ).rejects.toThrow()
    
    console.log('✅ 중복 삭제 방지 확인')
  })

  test('여러 레시피를 순차적으로 삭제할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const recipes = await Promise.all([
      agent.com.atproto.repo.createRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        record: createTestRecipe({ title: '삭제 테스트 1' }),
      }),
      agent.com.atproto.repo.createRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        record: createTestRecipe({ title: '삭제 테스트 2' }),
      }),
      agent.com.atproto.repo.createRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        record: createTestRecipe({ title: '삭제 테스트 3' }),
      }),
    ])

    for (const recipe of recipes) {
      const rkey = recipe.data.uri.split('/').pop()!
      await agent.com.atproto.repo.deleteRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey,
      })
    }
    
    for (const recipe of recipes) {
      const rkey = recipe.data.uri.split('/').pop()!
      await expect(
        agent.com.atproto.repo.getRecord({
          repo: did,
          collection: 'com.cookpad.recipe',
          rkey,
        })
      ).rejects.toThrow()
    }
    
    console.log('✅ 3개 레시피 일괄 삭제 성공')
  })

  test('삭제 후 같은 rkey로 새 레시피를 생성할 수 있다', async () => {
    const { agent, did } = await getTestAgent(TEST_DID)
    
    const customRkey = `test-${Date.now()}`
    
    const created = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: customRkey,
      record: createTestRecipe({ title: '원본 레시피' }),
    })

    await agent.com.atproto.repo.deleteRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: customRkey,
    })
    
    const recreated = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: customRkey,
      record: createTestRecipe({ title: '새 레시피' }),
    })
    
    expect(recreated.data.uri).toBe(created.data.uri)
    expect(recreated.data.cid).not.toBe(created.data.cid) 
    
    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey: customRkey,
    })
    
    expect((record.data.value as any).title).toBe('새 레시피')
    
    console.log('✅ 동일 rkey 재사용 성공')
  })
})
