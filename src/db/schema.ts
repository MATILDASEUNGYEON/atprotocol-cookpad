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

export type Recipe = {
  uri: string             
  cid: string              
  author_did: string       
  title: string
  description?: string
  servings?: number
  cook_time_minutes?: number
  thumbnail_url?: string   
  tags: string             
  visibility: 'draft' | 'published'
  created_at: string      
  indexed_at: string       
}

