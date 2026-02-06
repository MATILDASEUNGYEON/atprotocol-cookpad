export interface Country {
  code: string
  name: string
  flag: string
}

export interface FilterState {
  selectedCountry: string | null
  includeIngredients: string[]
  excludeIngredients: string[]
  photosInSteps: boolean
  withCooksnaps: boolean
}

export type SortTab = 'new' | 'ranking'

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
]

export interface CountryFilterProps{
  countries: Country[]
  selectedCountry: string | null
  onCountrySelect: (countryCode: string) => void
}

export interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export interface IngredientsFilterProps {
  includeIngredients: string[]
  excludeIngredients: string[]
  onIncludeAdd: (ingredient: string) => void
  onExcludeAdd: (ingredient: string) => void
  onIncludeRemove: (ingredient: string) => void
  onExcludeRemove: (ingredient: string) => void
}

export interface PremiumFiltersProps {
  photosInSteps: boolean
  withCooksnaps: boolean
  onPhotosInStepsChange: (value: boolean) => void
  onWithCooksnapsChange: (value: boolean) => void
}

export interface SearchHeaderProps {
  category: string
  totalCount: number
  activeTab: SortTab
  onTabChange: (tab: SortTab) => void
}