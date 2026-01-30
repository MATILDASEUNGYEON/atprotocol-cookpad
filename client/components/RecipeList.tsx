'use client'
import { RecipeListItem } from '@/types/recipeListItem'
import { RecipeCard } from './RecipeCard'

interface RecipeListProps {
  recipes: RecipeListItem[]
}

export default function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.uri} recipe={recipe} />
      ))}
    </div>
  )
}