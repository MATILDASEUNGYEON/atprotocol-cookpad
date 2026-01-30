'use client'

import { RecipeDraft } from '@/types/recipe'
import { useRouter } from 'next/navigation'

type Props = {
  recipe: RecipeDraft
}

export default function RecipeActions({ recipe }: Props) {
  const router = useRouter()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      // TODO: API call to delete recipe
      router.push('/') // Redirect to home
    }
  }

  const handleSaveAndClose = async () => {
    try {
      const formData = new FormData()
      
      if (recipe.thumbnail) {
        formData.append('thumbnail', recipe.thumbnail)
      }
      
      formData.append('title', recipe.title)
      formData.append('description', recipe.description)
      formData.append('serves', recipe.serves.toString())
      formData.append('cookTime', recipe.cookTime)
      formData.append('ingredients', JSON.stringify(recipe.ingredients))
      formData.append('tips', recipe.tips)
      formData.append('status', 'draft')

      recipe.steps.forEach((step, index) => {
        if (step.image) {
          formData.append(`step_${index}_image`, step.image)
        }
        formData.append(`step_${index}_description`, step.description)
      })

      // const response = await fetch('/api/recipes', {
      //   method: 'POST',
      //   body: formData,
      // })

      alert('Recipe saved as draft!')
      router.push('/profile') // Redirect to profile/my recipes
    } catch (error) {
      console.error('Failed to save recipe:', error)
      alert('Failed to save recipe')
    }
  }

  const handlePublish = async () => {
    if (!recipe.title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      const formData = new FormData()

      formData.append('title', recipe.title)
      formData.append('description', recipe.description)
      formData.append('serves', String(recipe.serves))
      formData.append('cookTime', recipe.cookTime)
      formData.append('ingredients', JSON.stringify(recipe.ingredients))
      formData.append('tips', recipe.tips)
      formData.append('status', 'published')

      if (recipe.thumbnail) {
        formData.append('thumbnail', recipe.thumbnail)
      }

      formData.append(
        'steps',
        JSON.stringify(
          recipe.steps.map(step => ({
            id: step.id,
            description: step.description,
          }))
        )
      )

      recipe.steps.forEach(step => {
        if (step.image) {
          formData.append(`stepImage:${step.id}`, step.image)
        }
      })

      const res = await fetch('/api/recipe', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      alert('Recipe published!')
      router.push('/')
    } catch (err) {
      console.error(err)
      alert('Failed to publish recipe')
    }
  }


  return (
    <div className="recipe-actions">
      <button className="delete-button" onClick={handleDelete}>
        🗑️ Delete
      </button>
      <button className="save-button" onClick={handleSaveAndClose}>
        Save and Close
      </button>
      <button className="publish-button" onClick={handlePublish}>
        Publish
      </button>
    </div>
  )
}
