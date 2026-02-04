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

      const stepsFormatted = recipe.steps
        .filter(step => step.description.trim())
        .map(step => ({
          id: step.id,
          text: step.description,
          image: step.image
        }))

      console.log('📤 Sending update:', {
        ingredients: ingredientsFormatted,
        steps: stepsFormatted
      })

      // Parse cookTime "1hr 30mins" format to minutes (same as upload)
      const cookTime = recipe.cookTime
      const hourMatch = cookTime.match(/(\d+)hr/)
      const minMatch = cookTime.match(/(\d+)mins?/)
      const cookTimeMinutes = (hourMatch ? parseInt(hourMatch[1]) * 60 : 0) + (minMatch ? parseInt(minMatch[1]) : 0)

      const formData = new FormData()
      formData.append('title', recipe.title)
      formData.append('description', recipe.description)
      formData.append('cook_time_minutes', String(cookTimeMinutes))
      formData.append('servings', String(recipe.serves))
      formData.append('ingredients', JSON.stringify(ingredientsFormatted))
      formData.append('steps', JSON.stringify(stepsFormatted.map(s => ({ 
        id: s.id, 
        text: s.text,
        existingImageUrl: typeof s.image === 'string' ? s.image : undefined
      }))))
      formData.append('thumbnail_url', typeof recipe.thumbnail === 'string' ? recipe.thumbnail : originalData?.thumbnail_url || '')

      recipe.steps.forEach(step => {
        if (step.image && step.image instanceof File) {
          formData.append(`stepImage:${step.id}`, step.image)
        }
      })

      const res = await fetch(`/api/recipe/${params.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error ?? '저장 실패')
        return
      }

      alert('레시피가 수정되었습니다.')
      window.location.href = `/recipe/${params.id}`
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
