'use client'

import { CountryFilterProps } from '@/types/filter'

export default function CountryFilter({ 
  countries, 
  selectedCountry, 
  onCountrySelect 
}: CountryFilterProps) {
  const selectedCountryData = countries.find(c => c.code === selectedCountry)

  return (
    <div className="country-filter">
      <div className="country-selected">
        <span className="label">Country Selected:</span>
        {selectedCountryData && (
          <span className="selected-country">
            "{selectedCountryData.name}" {selectedCountryData.flag}
          </span>
        )}
      </div>

      <div className="country-selector">
        <p className="selector-title">Select a Country to Explore Recipes:</p>
        <div className="country-flags">
          {countries.map((country) => (
            <button
              key={country.code}
              className={`country-flag ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => onCountrySelect(country.code)}
              title={country.name}
            >
              {country.flag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
