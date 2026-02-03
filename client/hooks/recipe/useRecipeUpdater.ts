import { useState, useEffect } from 'react'
import { RecipeDraft, IngredientItem, Step } from '@/types/recipe'

export function useRecipeUpdater(recipeId: string) {
  const [recipe, setRecipe] = useState<RecipeDraft>({
    title: '',
    description: '',
    serves: 2,
    cookTime: '',
    ingredients: [],
    steps: [],
    tips: '',
    status: 'published',
  })

  const [loading, setLoading] = useState(true)
  const [originalData, setOriginalData] = useState<any>(null)

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipe/${recipeId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch recipe')
        }

        const data = await res.json()
        console.log('📥 Fetched recipe data:', data)
        console.log('📥 Raw ingredients:', data.ingredients)
        console.log('📥 Raw steps:', data.steps)
        setOriginalData(data)

        // Convert API data to RecipeDraft format
        const ingredients: IngredientItem[] = Array.isArray(data.ingredients) 
          ? data.ingredients.map((ing: string | any) => ({
              id: crypto.randomUUID(),
              type: 'ingredient' as const,
              name: typeof ing === 'string' ? ing : (ing.name || ''),
            }))
          : []

        const steps: Step[] = Array.isArray(data.steps)
          ? data.steps.map((step: string | any, index: number) => {
              console.log(`📝 Processing step ${index + 1}:`, step)
              // Check if step is an object or string
              if (typeof step === 'string') {
                return {
                  id: crypto.randomUUID(),
                  description: step,
                  image: null,
                }
              } else {
                // Step is an object - prioritize 'text' field then 'description'
                const description = step.text || step.description || ''
                console.log(`   → Extracted description: "${description}"`)
                console.log(`   → Image:`, step.image)
                return {
                  id: crypto.randomUUID(),
                  description: description,
                  image: step.image || null,
                }
              }
            })
          : []

        console.log('🔄 Converted ingredients:', ingredients)
        console.log('🔄 Converted steps:', steps)
        console.log('🔄 Steps length:', steps.length)

        setRecipe({
          title: data.title || '',
          description: data.description || '',
          serves: data.servings || 2,
          cookTime: data.cook_time_minutes ? String(data.cook_time_minutes) : '',
          ingredients: ingredients.length > 0 ? ingredients : [{ id: crypto.randomUUID(), type: 'ingredient', name: '' }],
          steps: steps.length > 0 ? steps : [{ id: crypto.randomUUID(), description: '', image: null }],
          tips: '',
          status: 'published',
          thumbnail: data.thumbnail_url || null,
        })

        console.log('✅ Recipe state set successfully')

        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  return { recipe, setRecipe, loading, originalData }
}
