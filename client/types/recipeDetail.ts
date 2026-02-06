import {IngredientItem, Step } from './recipe'

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

export interface RecipeDetailActionsProps {
  isOwner: boolean
  isLoggedIn: boolean
  isLiked: boolean
  isSaved: boolean
  likesCount: number
  onLike: () => void
  onSave: () => void
  onAddToFolder: () => void
  onShare: () => void
  onDelete: () => void
  onEdit: () => void
}

export interface RecipeIngredientsDisplayProps{
  serves: number
  ingredients: IngredientItem[]
}

export interface RecipeDetailHeaderProps {
  title: string
  description: string
  author: {
    handle: string
    displayName?: string
    avatar?: string
  }
  status?: string
}