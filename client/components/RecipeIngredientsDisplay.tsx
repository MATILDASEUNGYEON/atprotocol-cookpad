'use client'

import Link from 'next/link'
import { RecipeIngredientsDisplayProps } from '@/types/recipeDetail'
import { normalizeIngredient } from '@/lib/tags'

export default function RecipeIngredientsDisplay({
  serves,
  ingredients
}: RecipeIngredientsDisplayProps) {
  return (
    <div className="recipe-ingredients-display">
      <div className="ingredients-header">
        <h2>Ingredients</h2>
        <div className="serves-info">
          <span className="icon">👥</span>
          <span>{serves} servings</span>
        </div>
      </div>
    
      <div className="ingredients-list">
        {ingredients.map((item, index) => {
          const key = `${item.type}-${item.id ?? index}`

          if (item.type === 'section') {
            return (
              <div key={key} className="ingredient-section-title">
                {item.title}
              </div>
            )
          }

          return (
            <div key={key} className="ingredient-item">
              <Link
                href={`/search/ingredient-${normalizeIngredient(item.name || '')}`}
                className="ingredient-link"
                style={{
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                {item.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
