'use client'

import Image from 'next/image'
import { Step } from '@/types/recipe'

interface RecipeStepsDisplayProps {
  cookTimeMinutes: number | string
  steps: Step[]
}

export default function RecipeStepsDisplay({
  cookTimeMinutes,
  steps
}: RecipeStepsDisplayProps) {
  
  console.log('🔍 [RecipeStepsDisplay] Received cookTimeMinutes:', cookTimeMinutes, typeof cookTimeMinutes)
  
  // 디버깅: steps 데이터 확인
  console.log('🔍 Steps data:', steps)
  
  return (
    <div className="recipe-steps-display">
      <div className="steps-header">
        <h2>Steps</h2>
        <div className="cook-time-info">
          <span className="icon">⏱️</span>
          <span>{cookTimeMinutes || '0mins'}</span>
        </div>
      </div>

      <div className="steps-list">
        {steps.map((step, index) => {
          console.log(`Step ${index + 1} image:`, step.image, typeof step.image)
          
          return (
            <div key={step.id || index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <p className="step-description">{step.description || step.text}</p>
                
                {step.image && (
                  <div className="step-images">
                    <div className="step-image">
                      {typeof step.image === 'string' ? (
                        <Image 
                          src={step.image} 
                          alt={`Step ${index + 1}`}
                          width={300}
                          height={200}
                          style={{ objectFit: 'cover' }}
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
          )
        })}
      </div>
    </div>
  )
}
