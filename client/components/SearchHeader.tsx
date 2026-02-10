'use client'

import { SearchHeaderProps } from '@/types/filter'

export default function SearchHeader({ 
  category, 
  totalCount, 
  activeTab, 
  onTabChange 
}: SearchHeaderProps) {
  const displayCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' & ')

  const getSubcategories = (cat: string) => {
    const subcategories: { [key: string]: string[] } = {
      'quick-easy': ['Appetizers', 'Breakfast', 'Dinners', 'Desserts'],
      'vegetarian': ['Salads', 'Main Courses', 'Snacks', 'Soups'],
      'desserts': ['Cakes', 'Cookies', 'Pies', 'Ice Cream']
    }
    return subcategories[cat] || []
  }

  const subcategories = getSubcategories(category)

  return (
    <div className="search-header">
      <div className="search-title">
        <h1>
          {displayCategory} <span className="count">({totalCount.toLocaleString()})</span>
        </h1>
      </div>

      {subcategories.length > 0 && (
        <div className="subcategories">
          {subcategories.map((sub) => (
            <a key={sub} href={`/search/${category}/${sub.toLowerCase()}`} className="subcategory-link">
              {displayCategory} {sub}
            </a>
          ))}
          <button className="see-more">See more</button>
        </div>
      )}

      <div className="sort-tabs">
        <button 
          className={`tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => onTabChange('new')}
        >
          New
        </button>
        <button 
          className={`tab ${activeTab === 'ranking' ? 'active' : ''}`}
          onClick={() => onTabChange('ranking')}
        >
          🏆 Ranking
        </button>
      </div>
    </div>
  )
}
