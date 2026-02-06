export type RecipeListItem = {
  uri: string 
  cid: string 
  author_did: string 
  
  title: string
  description?: string
  servings?: number
  cook_time_minutes?: string
  thumbnail_url?: string
  tags: string[]        
  visibility: 'draft' | 'published'
  
  created_at: string
  indexed_at: string
  
  ingredientSummary?: string
  bookmarked?: boolean
}
export interface RecipeListProps {
  recipes: RecipeListItem[]
}