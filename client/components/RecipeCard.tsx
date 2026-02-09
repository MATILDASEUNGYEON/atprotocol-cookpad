'use client'
import { useRouter } from 'next/navigation'
import { RecipeListItem } from '@/types/recipeListItem'
import Image from 'next/image'

export function RecipeCard({ recipe }: { recipe: RecipeListItem }) {
  const router = useRouter()
  const rkey = recipe.uri.split('/').pop()

  const handleClick = () => {
    if (rkey) {
      router.push(`/recipe/${rkey}`)
    }
  }

  return (
    <article className="recipe-card" onClick={handleClick}>
      <div className="recipe-image">
        <Image 
          src={recipe.thumbnail_url || '/placeholder-recipe.jpg'} 
          alt={recipe.title} 
          width={400} 
          height={200}
          priority
        />
      </div>
      <div className="recipe-info">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-ingredients">
          {recipe.description || recipe.ingredientSummary || '맛있는 레시피입니다'}
        </p>
        <div className="recipe-meta">
          <span className="recipe-time">
            ⏱️ {recipe.cook_time_minutes || '0mins'}
          </span>
          {recipe.servings && (
            <span className="recipe-servings">👥 {recipe.servings}인분</span>
          )}
        </div>
      </div>
    </article>
  )
}
