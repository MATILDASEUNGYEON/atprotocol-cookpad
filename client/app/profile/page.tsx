'use client'

import { Suspense, useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import '../styles/profile.css'

export default function ProfilePage() {
  const { userInfo, getInitials } = useAuth()
  const [activeTab, setActiveTab] = useState<'recipes' | 'cooksnaps'>('recipes')
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyRecipes() {
      if (!userInfo?.did) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/recipes?author=${userInfo.did}`)
        const data = await response.json()
        setRecipes(data.recipes || [])
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyRecipes()
  }, [userInfo?.did])

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className='home-layout'>
        <Sidebar />
        <div className='main-content'>
          <Header />
          <div className="profile-container loading">
            <ClipLoader size={36} color="#ff6b35" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='home-layout'>
      <Sidebar />

      <div className='main-content'>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>

        <div className="profile-container">
          <div className="profile-header">
            <div>
              <div className="profile-avatar">
                <span>{userInfo ? getInitials(userInfo.handle) : 'U'}</span>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{userInfo?.displayName || userInfo?.handle.split('.')[0] || 'User'}</h1>
                <p className="profile-handle">@{userInfo?.handle || 'user'}</p>
                
              </div>
            </div>
            <div className="profile-stats">
              <span className="stat"><strong>{userInfo?.followersCount ?? 0}</strong> Follower</span>
              <span className="stat"><strong>{userInfo?.followsCount ?? 0}</strong> Follow</span>    
            </div>
            <button 
                className="edit-profile-btn"
                onClick={() => window.location.href = '/profile/edit'}
                >
                Edit Profile
            </button>
          </div>

          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'recipes' ? 'active' : ''}`}
              onClick={() => setActiveTab('recipes')}
            >
              Recipe ({recipes.length})
            </button>
            <button 
              className={`tab ${activeTab === 'cooksnaps' ? 'active' : ''}`}
              onClick={() => setActiveTab('cooksnaps')}
            >
              Cooksnaps (0)
            </button>
          </div>

          {activeTab === 'recipes' ? (
  <>
    <div className="search-section">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search My Recipes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">Search</button>
      </div>
    </div>

    <div className="recipes-list">
      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">레시피가 없습니다</h3>
          <p className="empty-state-description">
            첫 번째 레시피를 업로드해보세요!
          </p>
          <button
            className="upload-btn"
            onClick={() => window.location.href = '/upload'}
          >
            레시피 업로드
          </button>
        </div>
      ) : (
        filteredRecipes.map((recipe) => (
          <div 
            key={recipe.uri} 
            className="recipe-item"
            onClick={() => {
              const rkey = recipe.uri.split('/').pop()
              window.location.href = `/recipe/${rkey}`
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="recipe-info">
              <div className="recipe-author">
                <div className="recipe-author-avatar">
                  <span>{userInfo ? getInitials(userInfo.handle) : 'U'}</span>
                </div>
                <span className="recipe-author-name">
                  {userInfo?.displayName ||
                    userInfo?.handle.split('.')[0] ||
                    'User'}
                </span>
              </div>

              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-ingredients">
                {recipe.description || ''}
              </p>

              <div className="recipe-meta">
                {recipe.cook_time_minutes && (
                  <span className="meta-item">
                    ⏱️ {recipe.cook_time_minutes}
                  </span>
                )}
                {recipe.servings && (
                  <span className="meta-item">
                    👥 {recipe.servings}인분
                  </span>
                )}
              </div>
            </div>

            <div className="recipe-thumbnail">
              {recipe.thumbnail_url ? (
                <img src={recipe.thumbnail_url} alt={recipe.title} />
              ) : (
                <div className="no-image">🍳</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </>
) : (
  <div className="empty-state">
    <div className="empty-state-icon">📸</div>
    <h3 className="empty-state-title">Cooksnaps 기능</h3>
    <p className="empty-state-description">
      Cooksnaps 기능은 현재 개발 중입니다.<br />
      곧 여러분의 요리 사진을 공유할 수 있습니다!
    </p>
  </div>
)}
        </div>
      </div>
    </div>  
  )
}