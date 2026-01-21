import { Agent } from '@atproto/api'
import { oauthClient } from '../src/auth/oauthClient'

/**
 * 레시피 조회 예제
 * 
 * 사용법:
 * tsx scripts/list-recipes.ts
 */

async function main() {
  const did = process.env.TEST_DID || 'did:plc:yola3ih3wdsyjzs22xi7wheb'
  
  console.log('🔍 레시피 조회 시작')
  console.log(`📝 DID: ${did}\n`)
  
  // OAuth 세션 복원
  const oauthSession = await oauthClient.restore(did)
  
  if (!oauthSession) {
    console.error('❌ 세션을 찾을 수 없습니다. 먼저 로그인하세요.')
    process.exit(1)
  }
  
  const agent = new Agent(oauthSession)
  
  console.log(`✅ PDS: ${oauthSession.serverMetadata.issuer}\n`)
  
  // 1️⃣ 모든 레시피 목록 조회
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📚 레시피 목록 조회')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const records = await agent.com.atproto.repo.listRecords({
    repo: did,
    collection: 'com.cookpad.recipe',
    limit: 50,
  })
  
  console.log(`총 ${records.data.records.length}개 레시피 발견\n`)
  
  if (records.data.records.length === 0) {
    console.log('레시피가 없습니다. 먼저 테스트를 실행하여 레시피를 생성하세요.')
    return
  }
  
  // 각 레시피 정보 출력
  for (const record of records.data.records) {
    const recipe = record.value as any
    const rkey = record.uri.split('/').pop()
    
    console.log('┌─────────────────────────────────────────────┐')
    console.log(`│ 🍳 ${recipe.title}`)
    console.log('├─────────────────────────────────────────────┤')
    console.log(`│ 📍 URI: ${record.uri}`)
    console.log(`│ 🔑 rkey: ${rkey}`)
    console.log(`│ 🏷️  CID: ${record.cid}`)
    console.log(`│`)
    
    if (recipe.description) {
      console.log(`│ 📝 ${recipe.description}`)
    }
    
    console.log(`│ 🥗 재료: ${recipe.ingredients.join(', ')}`)
    console.log(`│ 📋 조리 단계: ${recipe.steps.length}개`)
    
    if (recipe.cookTimeMinutes) {
      console.log(`│ ⏱️  조리 시간: ${recipe.cookTimeMinutes}분`)
    }
    
    if (recipe.servings) {
      console.log(`│ 👥 인분: ${recipe.servings}인분`)
    }
    
    if (recipe.tags && recipe.tags.length > 0) {
      console.log(`│ 🏷️  태그: ${recipe.tags.join(', ')}`)
    }
    
    console.log(`│ 📅 생성일: ${new Date(recipe.createdAt).toLocaleString('ko-KR')}`)
    
    if (recipe.updatedAt) {
      console.log(`│ 🔄 수정일: ${new Date(recipe.updatedAt).toLocaleString('ko-KR')}`)
    }
    
    console.log('└─────────────────────────────────────────────┘\n')
  }
  
  // 2️⃣ 특정 레시피 상세 조회 (첫 번째 레시피)
  if (records.data.records.length > 0) {
    const firstRecord = records.data.records[0]
    const rkey = firstRecord.uri.split('/').pop()!
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔎 특정 레시피 상세 조회 (첫 번째 레시피)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const detail = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    const recipe = detail.data.value as any
    
    console.log(`🍳 ${recipe.title}\n`)
    
    if (recipe.description) {
      console.log(`📝 ${recipe.description}\n`)
    }
    
    console.log('🥗 재료:')
    recipe.ingredients.forEach((ingredient: string, index: number) => {
      console.log(`  ${index + 1}. ${ingredient}`)
    })
    
    console.log('\n📋 조리 단계:')
    recipe.steps.forEach((step: any, index: number) => {
      console.log(`  ${index + 1}. ${step.text}`)
    })
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }
  
  // 3️⃣ URI로 직접 조회하는 방법
  console.log('💡 Tips: URI로 직접 조회하기\n')
  console.log('방법 1 - getRecord 사용:')
  console.log('```typescript')
  console.log('const record = await agent.com.atproto.repo.getRecord({')
  console.log('  repo: "did:plc:...",')
  console.log('  collection: "com.cookpad.recipe",')
  console.log('  rkey: "3mcvgrc66ok2j"')
  console.log('})')
  console.log('```\n')
  
  console.log('방법 2 - 전체 URI 사용:')
  console.log('at://did:plc:.../com.cookpad.recipe/[rkey]\n')
}

main().catch((error) => {
  console.error('❌ 에러 발생:', error)
  process.exit(1)
})
