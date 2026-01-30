'use client'

import { FilterState, COUNTRIES } from '@/types/filter'
import CountryFilter from './CountryFilter'
import IngredientsFilter from './IngredientsFilter'
import PremiumFilters from './PremiumFilters'

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleCountrySelect = (countryCode: string) => {
    onFilterChange({
      ...filters,
      selectedCountry: countryCode
    })
  }

  const handleIncludeAdd = (ingredient: string) => {
    if (!filters.includeIngredients.includes(ingredient)) {
      onFilterChange({
        ...filters,
        includeIngredients: [...filters.includeIngredients, ingredient]
      })
    }
  }

  const handleExcludeAdd = (ingredient: string) => {
    if (!filters.excludeIngredients.includes(ingredient)) {
      onFilterChange({
        ...filters,
        excludeIngredients: [...filters.excludeIngredients, ingredient]
      })
    }
  }

  const handleIncludeRemove = (ingredient: string) => {
    onFilterChange({
      ...filters,
      includeIngredients: filters.includeIngredients.filter(i => i !== ingredient)
    })
  }

  const handleExcludeRemove = (ingredient: string) => {
    onFilterChange({
      ...filters,
      excludeIngredients: filters.excludeIngredients.filter(i => i !== ingredient)
    })
  }

  const handlePhotosInStepsChange = (value: boolean) => {
    onFilterChange({
      ...filters,
      photosInSteps: value
    })
  }

  const handleWithCooksnapsChange = (value: boolean) => {
    onFilterChange({
      ...filters,
      withCooksnaps: value
    })
  }

  const handleReset = () => {
    onFilterChange({
      selectedCountry: 'US',
      includeIngredients: [],
      excludeIngredients: [],
      photosInSteps: false,
      withCooksnaps: false
    })
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <CountryFilter
        countries={COUNTRIES}
        selectedCountry={filters.selectedCountry}
        onCountrySelect={handleCountrySelect}
      />

      <IngredientsFilter
        includeIngredients={filters.includeIngredients}
        excludeIngredients={filters.excludeIngredients}
        onIncludeAdd={handleIncludeAdd}
        onExcludeAdd={handleExcludeAdd}
        onIncludeRemove={handleIncludeRemove}
        onExcludeRemove={handleExcludeRemove}
      />

      <PremiumFilters
        photosInSteps={filters.photosInSteps}
        withCooksnaps={filters.withCooksnaps}
        onPhotosInStepsChange={handlePhotosInStepsChange}
        onWithCooksnapsChange={handleWithCooksnapsChange}
      />
    </div>
  )
}
