import {Ingredient, IngredientSectionTitle, IngredientsEditorProps } from "@/types/recipe"
import { useState } from 'react'

export default function IngredientsEditor({ recipe, setRecipe }: IngredientsEditorProps) {
  const ingredients = recipe.ingredients || []
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addSection = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { id: crypto.randomUUID(), type: 'section', title: "" } as IngredientSectionTitle
      ]
    }))
  }

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { id: crypto.randomUUID(), type: 'ingredient', name: "" } as Ingredient
      ]
    }))
  }

  const updateItem = (id: string, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(item =>
        item.id === id
          ? item.type === 'section'
            ? { ...item, title: value }
            : { ...item, name: value }
          : item
      )
    }))
  }

  const removeItem = (id: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(item => item.id !== id)
    }))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newIngredients = [...ingredients]
    const draggedItem = newIngredients[draggedIndex]
    newIngredients.splice(draggedIndex, 1)
    newIngredients.splice(index, 0, draggedItem)

    setRecipe(prev => ({ ...prev, ingredients: newIngredients }))
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  if (ingredients.length === 0) {
    setRecipe(prev => ({
      ...prev,
      ingredients: [
        { id: crypto.randomUUID(), type: 'ingredient', name: "" },
        { id: crypto.randomUUID(), type: 'ingredient', name: "" }
      ]
    }))
  }

  return (
    <div className="ingredients-section">
      <h2>Ingredients</h2>

      <div className="serves-input">
        <label>Serves</label>
        <input
          type="number"
          value={recipe.serves || ""}
          onChange={(e) => setRecipe(prev => ({ ...prev, serves: parseInt(e.target.value) || 0 }))}
          placeholder="2"
        />
      </div>

      {ingredients.map((item, index) => (
        <div 
          key={item.id} 
          className="ingredient-row"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <span className="drag-handle">☰</span>
          <input
            type="text"
            value={item.type === 'section' ? item.title : item.name}
            onChange={(e) => updateItem(item.id, e.target.value)}
            placeholder={item.type === 'section' ? "Section" : "250g flour"}
          />
          <button
            className="menu-button"
            onClick={() => {
              if(confirm('Delete this item?')) {
                removeItem(item.id)
              }
            }}
            title="Remove"
          >
            ⋯
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button className="add-section-button" onClick={addSection}>
          + Section
        </button>
        <button className="add-ingredient-button" onClick={addIngredient}>
          + Ingredient
        </button>
      </div>
    </div>
  )
}
