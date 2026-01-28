'use client'

import { RecipeDraft } from '@/types/recipe'

type Props = {
  recipe: RecipeDraft
  setRecipe: React.Dispatch<React.SetStateAction<RecipeDraft>>
}

export default function RecipeHeader({ recipe, setRecipe }: Props) {
  return (
    <div className="recipe-header">
      <input
        type="text"
        className="title-input"
        placeholder="Title: My best-ever pea soup"
        value={recipe.title}
        onChange={(e) => setRecipe(r => ({ ...r, title: e.target.value }))}
      />
      
      <div className="author-section">
        <div className="author-avatar">
          <span>PA</span>
        </div>
        <span className="author-name">matilda</span>
        <span className="author-handle">@cook_115320765</span>
      </div>

      <textarea
        className="description-input"
        placeholder="Share a little more about this dish. What or who inspired you to cook it? What makes it special to you? What's your favourite way to eat it? Use #s to tag others."
        value={recipe.description}
        onChange={(e) => setRecipe(r => ({ ...r, description: e.target.value }))}
        rows={4}
      />
    </div>
  )
}
