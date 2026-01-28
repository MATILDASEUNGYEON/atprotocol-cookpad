'use client'

import { useRecipeEditor } from "@/hooks/recipe/useRecipeEditor"
import RecipeThumbnail from "@/components/uploadRecipe"
import RecipeHeader from "@/components/RecipeHeader"
import IngredientsEditor from "@/components/IngredientsEditor"
import StepsEditor from "@/components/StepsEditor"
import RecipeActions from "@/components/RecipeActions"
import Sidebar from "@/components/Sidebar"
import "../styles/upload.css"

export default function RecipeEditorPage() {
  const { recipe, setRecipe } = useRecipeEditor()

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="main-content">
        <div className="recipe-upload-container">
          <RecipeActions recipe={recipe} />

          <div className="recipe-editor-grid">
            <div className="editor-column">
              <RecipeThumbnail
                thumbnail={recipe.thumbnail}
                onChange={(file) =>
                  setRecipe(r => ({ ...r, thumbnail: file }))
                }
              />
              <IngredientsEditor recipe={recipe} setRecipe={setRecipe} />
            </div>

            <div className="editor-column">
              <RecipeHeader recipe={recipe} setRecipe={setRecipe} />
              <StepsEditor recipe={recipe} setRecipe={setRecipe} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
