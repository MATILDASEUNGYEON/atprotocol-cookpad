import { useState } from 'react'
import { RecipeDraft } from '../../types/recipe'

export function useRecipeEditor() {
  const [recipe, setRecipe] = useState<RecipeDraft>({
    title: '',
    description: '',
    serves: 2,
    cookTime: '',
    ingredients: [
      { id: crypto.randomUUID(), type: 'ingredient', name: '' },
      { id: crypto.randomUUID(), type: 'ingredient', name: '' },
      { id: crypto.randomUUID(), type: 'ingredient', name: '' },
    ],
    steps: [
      { id: crypto.randomUUID(), description: '', image: null },
    ],
    tips: '',
    status: 'draft',
  })

  return { recipe, setRecipe }
}
