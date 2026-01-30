'use client'

import { Suspense,useState, useMemo } from 'react'
import { mockRecipes } from '@/mock/recipe'
import Header from '@/components/header'
import RecipeList from '@/components/RecipeList'
import Sidebar from '@/components/Sidebar'
import SearchHeader from '@/components/SearchHeader'
import FilterPanel from '@/components/FilterPanel'
import { FilterState, SortTab } from '@/types/filter'
import '../../styles/search.css'

interface RecipeListPageProps {
  params: { category: string }
}

export default function RecipeListPage({ params }: RecipeListPageProps) {
  const [activeTab, setActiveTab] = useState<SortTab>('new')
  const [filters, setFilters] = useState<FilterState>({
    selectedCountry: 'US',
    includeIngredients: [],
    excludeIngredients: [],
    photosInSteps: false,
    withCooksnaps: false
  })

  const filteredRecipes = useMemo(() => {
    let filtered = [...mockRecipes]

    if (filters.includeIngredients.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.includeIngredients.every(ingredient =>
          recipe.ingredientSummary?.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    }

    if (filters.excludeIngredients.length > 0) {
      filtered = filtered.filter(recipe =>
        !filters.excludeIngredients.some(ingredient =>
          recipe.ingredientSummary?.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    }
    
    return filtered
  }, [filters])

  return (
    <div className='home-layout'>
      <Sidebar />

      <div className='main-content'>
        <Suspense fallback={<div>Loading...</div>}>
            <Header />
        </Suspense>

        <main className='content-area'>
          <div className='search-layout'>
            <div className='search-content'>
              <SearchHeader
                category={params.category}
                totalCount={filteredRecipes.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              {activeTab === 'new' ? (
                <RecipeList recipes={filteredRecipes} />
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <h3 className="empty-state-title">Ranking 기능</h3>
                  <p className="empty-state-description">
                    Ranking 기능은 현재 개발 중입니다.<br />
                    곧 인기 레시피를 확인할 수 있습니다!
                  </p>
                </div>
              )}
            </div>

            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
