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
  thumbnail?: File | null
  title: string
  description: string
  serves: number
  cookTime: string
  ingredients: IngredientItem[]
  steps: Step[]
  tips: string
  status: 'draft' | 'published'
}
