'use client'

import { Suspense, useState } from 'react'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import '../styles/profile.css'

export default function ProfilePage() {
  const { userInfo, getInitials } = useAuth()
  const [activeTab, setActiveTab] = useState<'recipes' | 'cooksnaps'>('recipes')
  const [searchQuery, setSearchQuery] = useState('')

  const mockRecipes = [
    {
      id: '1',
      title: 'Dubai Mochi',
      ingredients: 'butter · marshmallows · milk powder mix · cocoa powder · pistachio spread · roasted kataifi pastry',
      time: '1hr 30mins',
      servings: '1 serving',
      thumbnail: null
    }
  ]

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <span className="stat"><strong>0</strong> Following</span>
                <span className="stat"><strong>0</strong> Followers</span>
            </div>
            {/* <button className="edit-profile-btn">Edit Profile</button> */}
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
              Recipe ({mockRecipes.length})
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
                {filteredRecipes.map(recipe => (
                  <div key={recipe.id} className="recipe-item">
                    <div className="recipe-info">
                      <div className="recipe-author">
                        <div className="recipe-author-avatar">
                          <span>{userInfo ? getInitials(userInfo.handle) : 'U'}</span>
                        </div>
                        <span className="recipe-author-name">{userInfo?.displayName || userInfo?.handle.split('.')[0] || 'matilda'}</span>
                      </div>
                      
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <p className="recipe-ingredients">{recipe.ingredients}</p>
                      
                      <div className="recipe-meta">
                        <span className="meta-item">⏱️ {recipe.time}</span>
                        <span className="meta-item">👥 {recipe.servings}</span>
                      </div>
                    </div>
                    
                    <div className="recipe-thumbnail">
                      {recipe.thumbnail ? (
                        <img src={recipe.thumbnail} alt={recipe.title} />
                      ) : (
                        <div className="placeholder-thumbnail">
                          <span>🍳</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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