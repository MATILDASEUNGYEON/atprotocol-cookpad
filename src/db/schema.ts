export type DatabaseSchema = {
  auth_state: AuthState
  auth_session: AuthSession
  recipe: Recipe
}

export type AuthState = {
  key: string
  state: string
}

export type AuthSession = {
  key: string
  session: string
}

// AppView용 Recipe 인덱스 테이블
export type Recipe = {
  uri: string              // at://did:plc:xxx/com.cookpad.recipe/3kabc
  cid: string              // record의 content hash
  author_did: string       // 작성자 DID
  title: string
  description?: string
  servings?: number
  cook_time_minutes?: number
  thumbnail_url?: string   // blob URL
  tags: string             // JSON string (SQLite는 배열을 직접 저장 불가)
  visibility: 'draft' | 'published'
  created_at: string       // ISO timestamp
  indexed_at: string       // AppView에 인덱싱된 시간
}

