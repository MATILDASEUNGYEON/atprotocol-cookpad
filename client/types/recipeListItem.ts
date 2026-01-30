// types/recipe.ts <나중에 pds 연동하면 삭제 예정>
export type RecipeListItem = {
  uri: string
  title: string
  description: string
  thumbnailUrl: string

  cookTimeMinutes: number
  serves: number

  ingredientSummary: string  
  author: {
    handle: string
    did: string
  }

  bookmarked?: boolean
}
