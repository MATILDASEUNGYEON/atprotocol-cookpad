'use client'

import { IngredientItem } from '@/types/recipe'

interface RecipeIngredientsDisplayProps {
  serves: number
  ingredients: IngredientItem[]
}

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
        {ingredients.map((item) => {
          if (item.type === 'section') {
            return (
              <div key={item.id} className="ingredient-section-title">
                {item.title}
              </div>
            )
          }

          return (
            <div key={item.id} className="ingredient-item">
              <span className="ingredient-name">{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
