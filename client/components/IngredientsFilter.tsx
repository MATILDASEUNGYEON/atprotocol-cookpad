'use client'

import { useState, KeyboardEvent } from 'react'
import {IngredientsFilterProps} from "@/types/filter"

export default function IngredientsFilter({
  includeIngredients,
  excludeIngredients,
  onIncludeAdd,
  onExcludeAdd,
  onIncludeRemove,
  onExcludeRemove
}: IngredientsFilterProps) {
  const [includeInput, setIncludeInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')

  const handleIncludeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && includeInput.trim()) {
      onIncludeAdd(includeInput.trim())
      setIncludeInput('')
    }
  }

  const handleExcludeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && excludeInput.trim()) {
      onExcludeAdd(excludeInput.trim())
      setExcludeInput('')
    }
  }

  return (
    <div className="ingredients-filter">
      <div className="filter-section">
        <label className="filter-label">Show me recipes with:</label>
        <input
          type="text"
          className="ingredient-input"
          placeholder="Type ingredients..."
          value={includeInput}
          onChange={(e) => setIncludeInput(e.target.value)}
          onKeyDown={handleIncludeKeyDown}
        />
        {includeIngredients.length > 0 && (
          <div className="ingredient-tags">
            {includeIngredients.map((ingredient) => (
              <span key={ingredient} className="ingredient-tag">
                {ingredient}
                <button
                  onClick={() => onIncludeRemove(ingredient)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <label className="filter-label">Show me recipes without:</label>
        <input
          type="text"
          className="ingredient-input"
          placeholder="Type ingredients..."
          value={excludeInput}
          onChange={(e) => setExcludeInput(e.target.value)}
          onKeyDown={handleExcludeKeyDown}
        />
        {excludeIngredients.length > 0 && (
          <div className="ingredient-tags">
            {excludeIngredients.map((ingredient) => (
              <span key={ingredient} className="ingredient-tag">
                {ingredient}
                <button
                  onClick={() => onExcludeRemove(ingredient)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
