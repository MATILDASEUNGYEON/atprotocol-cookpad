// types/filter.ts

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
