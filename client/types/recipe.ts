export type Ingredient = {
  id: string
  type: 'ingredient'
  name: string
}

export type IngredientSectionTitle = {
  id: string
  type: 'section'
  title: string
}

export type IngredientItem = Ingredient | IngredientSectionTitle

export type Step = {
  id: string
  description: string
  text?: string  
  image?: File | string | null  
}

export type RecipeDraft = {
  thumbnail?: File | string | null
  title: string
  description: string
  serves: number
  cookTime: string
  ingredients: IngredientItem[]
  steps: Step[]
  tips: string
  status: 'draft' | 'published'
}

export interface IngredientsEditorProps {
  recipe: RecipeDraft
  setRecipe: (updater: (prev: RecipeDraft) => RecipeDraft) => void
}

export type RecipeEditActionsProps = {
  recipe: RecipeDraft
  recipeId: string
  onSave: () => Promise<void>
  saving: boolean
}
export type RecipeHeaderProps = {
  recipe: RecipeDraft
  setRecipe: React.Dispatch<React.SetStateAction<RecipeDraft>>
}

export interface RecipeStepsDisplayProps {
  cookTimeMinutes: number | string
  steps: Step[]
}
export type StepsEditorProps = {
  recipe: RecipeDraft
  setRecipe: React.Dispatch<React.SetStateAction<RecipeDraft>>
}
export type RecipeThumbnailProps = {
  thumbnail?: File | string | null
  onChange: (file: File) => void
}