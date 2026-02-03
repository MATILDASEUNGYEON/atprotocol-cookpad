'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { useRecipeUpdater } from '@/hooks/recipe/useRecipeUpdater'
import RecipeThumbnail from '@/components/uploadRecipe'
import RecipeHeader from '@/components/RecipeHeader'
import IngredientsEditor from '@/components/IngredientsEditor'
import StepsEditor from '@/components/StepsEditor'
import RecipeEditActions from '@/components/RecipeEditActions'
import Sidebar from '@/components/Sidebar'
import '../../../styles/upload.css'

export default function RecipeEditPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { recipe, setRecipe, loading, originalData } = useRecipeUpdater(params.id)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    try {
      // Convert ingredients to API format
      const ingredientsFormatted = recipe.ingredients
        .filter(ing => {
          if (ing.type === 'section') return ing.title?.trim()
          return ing.name?.trim()
        })
        .map(ing => {
          if (ing.type === 'section') {
            return {
              type: 'section',
              title: (ing as any).title,
              name: undefined
            }
          } else {
            return {
              type: 'ingredient',
              name: (ing as any).name,
              title: undefined
            }
          }
        })

      // Convert steps to API format (keep original structure with image)
      const stepsFormatted = recipe.steps
        .filter(step => step.description.trim())
        .map(step => ({
          text: step.description,
          image: step.image || undefined
        }))

      console.log('📤 Sending update:', {
        ingredients: ingredientsFormatted,
        steps: stepsFormatted
      })

      const res = await fetch(`/api/recipe/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: recipe.title,
          description: recipe.description,
          cook_time_minutes: recipe.cookTime ? parseInt(recipe.cookTime) : 0,
          servings: recipe.serves,
          ingredients: ingredientsFormatted,
          steps: stepsFormatted,
          thumbnail_url: typeof recipe.thumbnail === 'string' ? recipe.thumbnail : originalData?.thumbnail_url || '',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error ?? '저장 실패')
        return
      }

      alert('레시피가 수정되었습니다.')
      router.push(`/recipe/${params.id}`)
    } catch (error) {
      console.error('Failed to update recipe:', error)
      alert('레시피 수정 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="home-layout">
        <Sidebar />
        <div className="main-content">
          <div className="recipe-upload-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <ClipLoader size={36} color="#ff6b35" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="main-content">
        <div className="recipe-upload-container">
          <RecipeEditActions 
            recipe={recipe} 
            recipeId={params.id}
            onSave={handleSave}
            saving={saving}
          />

          <div className="recipe-editor-grid">
            <div className="editor-column">
              <RecipeThumbnail
                thumbnail={recipe.thumbnail}
                onChange={(file) =>
                  setRecipe(r => ({ ...r, thumbnail: file }))
                }
              />
              <IngredientsEditor recipe={recipe} setRecipe={setRecipe} />
            </div>

            <div className="editor-column">
              <RecipeHeader recipe={recipe} setRecipe={setRecipe} />
              <StepsEditor recipe={recipe} setRecipe={setRecipe} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
