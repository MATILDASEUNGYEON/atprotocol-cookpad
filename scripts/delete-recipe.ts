import { Agent } from '@atproto/api'
import { oauthClient } from '../src/auth/oauthClient'

/**
 * 특정 레시피 삭제 스크립트
 * 
 * 사용법:
 * tsx scripts/delete-recipe.ts [rkey]
 * 
 * 예제:
 * tsx scripts/delete-recipe.ts 3mcvgrc66ok2j
 */

async function main() {
  const did = process.env.TEST_DID || 'did:plc:yola3ih3wdsyjzs22xi7wheb'
  const rkey = process.argv[2]
  
  if (!rkey) {
    console.error('❌ rkey를 지정하세요')
    console.log('\n사용법: tsx scripts/delete-recipe.ts [rkey]')
    console.log('예제: tsx scripts/delete-recipe.ts 3mcvgrc66ok2j\n')
    process.exit(1)
  }
  
  console.log('🗑️  레시피 삭제 시작')
  console.log(`📝 DID: ${did}`)
  console.log(`🔑 rkey: ${rkey}\n`)
  
  // OAuth 세션 복원
  const oauthSession = await oauthClient.restore(did)
  
  if (!oauthSession) {
    console.error('❌ 세션을 찾을 수 없습니다. 먼저 로그인하세요.')
    process.exit(1)
  }
  
  const agent = new Agent(oauthSession)
  
  // 삭제 전 확인
  try {
    const record = await agent.com.atproto.repo.getRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    const recipe = record.data.value as any
    console.log(`삭제할 레시피: "${recipe.title}"`)
    console.log(`URI: ${record.data.uri}\n`)
    
    // 삭제 실행
    await agent.com.atproto.repo.deleteRecord({
      repo: did,
      collection: 'com.cookpad.recipe',
      rkey,
    })
    
    console.log('✅ 삭제 완료\n')
  } catch (error: any) {
    if (error.message?.includes('RecordNotFound')) {
      console.error('❌ 레시피를 찾을 수 없습니다.')
    } else {
      console.error('❌ 삭제 실패:', error.message)
    }
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ 에러 발생:', error)
  process.exit(1)
})
