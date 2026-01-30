// types/recipeDetail.ts
import { Ingredient, IngredientItem, Step } from './recipe'

export interface RecipeDetail {
  uri: string
  title: string
  description: string
  thumbnailUrl: string
  cookTimeMinutes: number
  serves: number
  
  ingredients: IngredientItem[]
  steps: Step[]
  tips?: string
  
  author: {
    handle: string
    did: string
    displayName?: string
    avatar?: string
  }
  
  likesCount: number
  isLiked: boolean
  isBookmarked: boolean
  
  createdAt: string
  updatedAt?: string
}

export interface RecipeDetailActions {
  onSave: () => void
  onAddToFolder: () => void
  onShare: () => void
  onPrint: () => void
  onLike: () => void
  onBookmark: () => void
}
