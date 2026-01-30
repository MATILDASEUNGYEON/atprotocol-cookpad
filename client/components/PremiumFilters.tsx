'use client'

interface PremiumFiltersProps {
  photosInSteps: boolean
  withCooksnaps: boolean
  onPhotosInStepsChange: (value: boolean) => void
  onWithCooksnapsChange: (value: boolean) => void
}

export default function PremiumFilters({
  photosInSteps,
  withCooksnaps,
  onPhotosInStepsChange,
  onWithCooksnapsChange
}: PremiumFiltersProps) {
  return (
    <div className="premium-filters">
      <div className="premium-header">
        <span className="premium-icon">🏆</span>
        <span className="premium-title">Premium filters</span>
        <button className="arrow-btn">→</button>
      </div>

      <div className="premium-options">
        <label className="premium-option">
          <span>Show recipes with photos in steps</span>
          <input
            type="checkbox"
            checked={photosInSteps}
            onChange={(e) => onPhotosInStepsChange(e.target.checked)}
          />
        </label>

        <label className="premium-option">
          <span>Recipes with Cooksnaps</span>
          <input
            type="checkbox"
            checked={withCooksnaps}
            onChange={(e) => onWithCooksnapsChange(e.target.checked)}
          />
        </label>
      </div>
    </div>
  )
}
