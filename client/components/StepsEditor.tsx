'use client'

import { RecipeDraft, Step } from '@/types/recipe'
import { useState } from 'react'

type Props = {
  recipe: RecipeDraft
  setRecipe: React.Dispatch<React.SetStateAction<RecipeDraft>>
}

export default function StepsEditor({ recipe, setRecipe }: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addStep = () => {
    const newStep: Step = {
      id: crypto.randomUUID(),
      description: '',
      image: null,
    }
    setRecipe(r => ({
      ...r,
      steps: [...r.steps, newStep],
    }))
  }

  const deleteStep = (stepId: string) => {
    setRecipe(r => ({
      ...r,
      steps: r.steps.filter(s => s.id !== stepId),
    }))
  }

  const updateStepDescription = (stepId: string, description: string) => {
    setRecipe(r => ({
      ...r,
      steps: r.steps.map(s =>
        s.id === stepId ? { ...s, description } : s
      ),
    }))
  }

  const updateStepImage = (stepId: string, image: File | null) => {
    setRecipe(r => ({
      ...r,
      steps: r.steps.map(s =>
        s.id === stepId ? { ...s, image } : s
      ),
    }))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newSteps = [...recipe.steps]
    const draggedStep = newSteps[draggedIndex]
    newSteps.splice(draggedIndex, 1)
    newSteps.splice(index, 0, draggedStep)

    setRecipe(r => ({ ...r, steps: newSteps }))
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const parseCookTime = (cookTime: string) => {
    const hourMatch = cookTime.match(/(\d+)hr/)
    const minMatch = cookTime.match(/(\d+)mins?/)
    return {
      hours: hourMatch ? parseInt(hourMatch[1]) : 0,
      minutes: minMatch ? parseInt(minMatch[1]) : 0
    }
  }

  const { hours, minutes } = parseCookTime(recipe.cookTime)

  const handleHoursChange = (value: string) => {
    const h = parseInt(value) || 0
    const cookTime = h > 0 || minutes > 0 
      ? `${h > 0 ? `${h}hr ` : ''}${minutes > 0 ? `${minutes}mins` : ''}`.trim()
      : ''
    console.log('🔍 [StepsEditor] Hours changed - Setting cookTime:', cookTime)
    setRecipe(r => ({ ...r, cookTime }))
  }

  const handleMinutesChange = (value: string) => {
    const m = parseInt(value) || 0
    const cookTime = hours > 0 || m > 0
      ? `${hours > 0 ? `${hours}hr ` : ''}${m > 0 ? `${m}mins` : ''}`.trim()
      : ''
    console.log('🔍 [StepsEditor] Minutes changed - Setting cookTime:', cookTime)
    setRecipe(r => ({ ...r, cookTime }))
  }

  return (
    <div className="steps-section">
      <h2>Steps</h2>
      
      <div className="cook-time-input">
        <label>Cook time</label>
        <div className="time-inputs">
          <input
            type="number"
            min="0"
            max="24"
            value={hours || ""}
            onChange={(e) => handleHoursChange(e.target.value)}
            placeholder="HH"
          />
          <span>:</span>
          <input
            type="number"
            min="0"
            max="59"
            step="10"
            value={minutes || ""}
            onChange={(e) => handleMinutesChange(e.target.value)}
            placeholder="MM"
          />
        </div>
      </div>

      {recipe.steps.map((step, index) => (
        <div
          key={step.id}
          className="step-item"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="step-header">
            <span className="drag-handle">≡</span>
            <span className="step-number">{index + 1}</span>
            <button
              className="menu-button"
              onClick={() => {
                if (confirm('Delete this step?')) {
                  deleteStep(step.id)
                }
              }}
            >
              •••
            </button>
          </div>

          <textarea
            className="step-description"
            placeholder="Mix the flour and water until they thicken."
            value={step.description}
            onChange={(e) => updateStepDescription(step.id, e.target.value)}
            rows={3}
          />

          <label className="step-image-upload">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  updateStepImage(step.id, e.target.files[0])
                }
              }}
            />
            {step.image ? (
              <img src={typeof step.image === 'string' ? step.image : URL.createObjectURL(step.image)} alt={`Step ${index + 1}`} />
            ) : (
              <div className="image-placeholder">
                <span>📷</span>
              </div>
            )}
          </label>
        </div>
      ))}

      <button className="add-step-button" onClick={addStep}>
        + Step
      </button>

      <textarea
        className="tips-input"
        placeholder="What are your points for making it tasty?"
        value={recipe.tips}
        onChange={(e) => setRecipe(r => ({ ...r, tips: e.target.value }))}
        rows={3}
      />
    </div>
  )
}
