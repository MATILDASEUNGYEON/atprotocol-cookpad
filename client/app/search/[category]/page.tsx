'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import Header from '@/components/header'
import RecipeList from '@/components/RecipeList'
import Sidebar from '@/components/Sidebar'
import SearchHeader from '@/components/SearchHeader'
import FilterPanel from '@/components/FilterPanel'
import { FilterState, SortTab } from '@/types/filter'
import { RecipeListItem } from '@/types/recipeListItem'
import { formatTag } from '@/lib/tags'
import '../../styles/search.css'

interface RecipeListPageProps {
  params: { category: string }
}

export default function RecipeListPage({ params }: RecipeListPageProps) {
  const [activeTab, setActiveTab] = useState<SortTab>('new')
  const [recipes, setRecipes] = useState<RecipeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    selectedCountry: 'US',
    includeIngredients: [],
    excludeIngredients: [],
    photosInSteps: false,
    withCooksnaps: false
  })

  const { prefix, value, displayName } = useMemo(() => {
    const parts = params.category.split('-')
    const prefix = parts[0] || 'ingredient'
    const value = parts.slice(1).join('-') || params.category
    const tag = `${prefix}:${value}`
    const displayName = formatTag(tag)
    
    return { prefix, value, displayName }
  }, [params.category])

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)
        setError(null)
        
        const appViewUrl = process.env.NEXT_PUBLIC_APP_VIEW_URL || 'http://localhost:3000'
        const response = await fetch(`${appViewUrl}/api/recipes/by-tag/${prefix}/${value}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes')
        }
        
        const data = await response.json()
        setRecipes(data.recipes || [])
      } catch (err) {
        console.error('Failed to fetch recipes:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [prefix, value])

  const filteredRecipes = useMemo(() => {
    let filtered = [...recipes]

    if (filters.includeIngredients.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.includeIngredients.every(ingredient =>
          recipe.tags.some(tag => tag.toLowerCase().includes(ingredient.toLowerCase()))
        )
      )
    }

    if (filters.excludeIngredients.length > 0) {
      filtered = filtered.filter(recipe =>
        !filters.excludeIngredients.some(ingredient =>
          recipe.tags.some(tag => tag.toLowerCase().includes(ingredient.toLowerCase()))
        )
      )
    }
    
    return filtered
  }, [recipes, filters])

  return (
    <div className='home-layout'>
      <Sidebar />

      <div className='main-content'>
        <Suspense fallback={<div>Loading...</div>}>
            <Header />
        </Suspense>

        <main className='content-area'>
          <div className='search-layout'>
            <div className="search-content">
              <SearchHeader
                category={displayName}
                totalCount={filteredRecipes.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {loading && (
                <div className="empty-state">
                  <div className="empty-state-icon">⏳</div>
                  <h3 className="empty-state-title">Loading recipes...</h3>
                </div>
              )}

              {error && (
                <div className="empty-state">
                  <div className="empty-state-icon">❌</div>
                  <h3 className="empty-state-title">Error</h3>
                  <p className="empty-state-description">{error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  {activeTab === 'new' && (
                    filteredRecipes.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">No recipes found</h3>
                        <p className="empty-state-description">
                          No recipes found with {displayName}.<br />
                          Be the first to create one!
                        </p>
                      </div>
                    ) : (
                      <RecipeList recipes={filteredRecipes} />
                    )
                  )}

                  {activeTab === 'ranking' && (
                    <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <h3 className="empty-state-title">Ranking 기능</h3>
                      <p className="empty-state-description">
                        Ranking 기능은 현재 개발 중입니다.<br />
                        곧 인기 레시피를 확인할 수 있습니다!
                      </p>
                    </div>
                  )}
                </>
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
