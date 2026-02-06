'use client'

import { RecipeEditActionsProps } from '@/types/recipe'
import { useRouter } from 'next/navigation'

export default function RecipeEditActions({ recipe, recipeId, onSave, saving }: RecipeEditActionsProps) {
  const router = useRouter()

  const handleCancel = () => {
    if (confirm('변경 사항을 저장하지 않고 나가시겠습니까?')) {
      router.push(`/recipe/${recipeId}`)
    }
  }

  const handleSave = async () => {
    if (!recipe.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    await onSave()
  }

  return (
    <div className="recipe-actions">
      <button className="delete-button" onClick={handleCancel}>
        ← Cancel
      </button>
      <button className="publish-button" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}
