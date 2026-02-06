'use client'
import { RecipeListProps } from '@/types/recipeListItem'
import { RecipeCard } from './RecipeCard'

export default function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🍳</div>
        <h3 className="empty-state-title">레시피가 없습니다</h3>
        <p className="empty-state-description">
          아직 등록된 레시피가 없습니다.<br />
          첫 번째 레시피를 등록해보세요!
        </p>
      </div>
    )
  }

  return (
    <div className="recipe-list-container">
      <div className="recipe-count">
        총 <strong>{recipes.length}</strong>개의 레시피
      </div>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.uri} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}