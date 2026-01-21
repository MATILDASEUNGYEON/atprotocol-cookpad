import { Agent } from '@atproto/api'
import { oauthClient } from '../src/auth/oauthClient'

/**
 * 모든 테스트 레시피 정리 스크립트
 * 
 * 사용법:
 * tsx scripts/cleanup-recipes.ts
 */

async function main() {
  const did = process.env.TEST_DID || 'did:plc:yola3ih3wdsyjzs22xi7wheb'
  
  console.log('🧹 레시피 정리 시작')
  console.log(`📝 DID: ${did}\n`)
  
  // OAuth 세션 복원
  const oauthSession = await oauthClient.restore(did)
  
  if (!oauthSession) {
    console.error('❌ 세션을 찾을 수 없습니다. 먼저 로그인하세요.')
    process.exit(1)
  }
  
  const agent = new Agent(oauthSession)
  
  // 모든 레시피 조회
  const records = await agent.com.atproto.repo.listRecords({
    repo: did,
    collection: 'com.cookpad.recipe',
    limit: 100,
  })
  
  console.log(`📚 총 ${records.data.records.length}개 레시피 발견\n`)
  
  if (records.data.records.length === 0) {
    console.log('✅ 삭제할 레시피가 없습니다.')
    return
  }
  
  // 각 레시피 삭제
  for (const record of records.data.records) {
    const recipe = record.value as any
    const rkey = record.uri.split('/').pop()!
    
    console.log(`🗑️  삭제 중: "${recipe.title}" (${rkey})`)
    
    try {
      await agent.com.atproto.repo.deleteRecord({
        repo: did,
        collection: 'com.cookpad.recipe',
        rkey,
      })
      console.log(`   ✅ 삭제 완료`)
    } catch (error: any) {
      console.log(`   ❌ 삭제 실패: ${error.message}`)
    }
  }
  
  console.log(`\n✨ 정리 완료! ${records.data.records.length}개 레시피 삭제됨\n`)
}

main().catch((error) => {
  console.error('❌ 에러 발생:', error)
  process.exit(1)
})
