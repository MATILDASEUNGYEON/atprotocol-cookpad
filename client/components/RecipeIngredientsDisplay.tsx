'use client'

import Link from 'next/link'
import { IngredientItem } from '@/types/recipe'
import { normalizeIngredient } from '@/lib/tags'

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
              <Link 
                href={`/search/ingredient-${normalizeIngredient(item.name || '')}`}
                className="ingredient-link"
                style={{
                  textDecoration: 'underline',
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
