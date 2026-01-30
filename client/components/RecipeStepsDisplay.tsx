'use client'

import Image from 'next/image'
import { Step } from '@/types/recipe'

interface RecipeStepsDisplayProps {
  cookTimeMinutes: number
  steps: Step[]
}

export default function RecipeStepsDisplay({
  cookTimeMinutes,
  steps
}: RecipeStepsDisplayProps) {
  return (
    <div className="recipe-steps-display">
      <div className="steps-header">
        <h2>Steps</h2>
        <div className="cook-time-info">
          <span className="icon">⏱️</span>
          <span>{cookTimeMinutes} mins</span>
        </div>
      </div>

      <div className="steps-list">
        {steps.map((step, index) => (
          <div key={step.id} className="step-item">
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <p className="step-description">{step.description}</p>
              
              {step.image && (
                <div className="step-images">
                  {/* For now showing single image, can be extended to multiple */}
                  <div className="step-image">
                    {typeof step.image === 'string' ? (
                      <Image 
                        src={step.image} 
                        alt={`Step ${index + 1}`}
                        width={300}
                        height={200}
                        objectFit="cover"
                      />
                    ) : (
                      <div className="image-placeholder">
                        Image
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
