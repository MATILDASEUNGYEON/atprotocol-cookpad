'use client'
import { RecipeListItem } from '@/types/recipeListItem'

export function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  return (
    <article>
      <img src={recipe.thumbnailUrl} />
      <h3>{recipe.title}</h3>
      <p>{recipe.ingredientSummary}</p>
      <span>{recipe.cookTimeMinutes} mins</span>
    </article>
  )
}
