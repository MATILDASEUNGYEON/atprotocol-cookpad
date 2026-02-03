/**
 * ATProtocol AppView에서 제공하는 레시피 목록 아이템
 * AppView DB의 Recipe 스키마와 매칭됨
 */
export type RecipeListItem = {
  uri: string 
  cid: string 
  author_did: string 
  
  title: string
  description?: string
  servings?: number
  // cook_time_minutes?: 
  cook_time_minutes?: string
  thumbnail_url?: string
  tags: string[]        
  visibility: 'draft' | 'published'
  
  created_at: string
  indexed_at: string
  
  ingredientSummary?: string
  bookmarked?: boolean
}
