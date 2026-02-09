'use client'

import { Suspense } from 'react'
import Header from '../components/header'
import Sidebar from '../components/Sidebar'

export default function HomePage() {
  const handleLogin = () => {
    window.location.href = '/login'
  }

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Header onLoginClick={handleLogin} />
        </Suspense>

        <main className="content-area">
          <div className="search-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by recipe or ingredients"
                className="search-input"
              />
              <button className="search-btn">Search</button>
            </div>
          </div>

          <div className="hero-section">
            <h2>Share your recipe in 3 easy steps:</h2>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <p>Choose a favorite recipe that you love to cook</p>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <p>Add your recipe, following the simple guide</p>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <p>Share! And see others from around the world cook your recipe!</p>
              </div>
            </div>
          </div>

          <section className="category-section">
            <div className="section-header">
              <h3>Key Word</h3>
            </div>
            <div className="category-grid">
              <div 
                className="category-placeholder"
                onClick={() => window.location.href = '/search/attribute-quick'}
                style={{ cursor: 'pointer' }}
              >
                ⚡ Quick & Easy Recipes
              </div>
              <div 
                className="category-placeholder"
                onClick={() => window.location.href = '/search/attribute-dessert'}
                style={{ cursor: 'pointer' }}
              >
                🍰 Dessert
              </div>
              <div 
                className="category-placeholder"
                onClick={() => window.location.href = '/search/attribute-vegan'}
                style={{ cursor: 'pointer' }}
              >
                🌱 Vegan
              </div>
              <div 
                className="category-placeholder"
                onClick={() => window.location.href = '/search/attribute-healthy'}
                style={{ cursor: 'pointer' }}
              >
                🦾 healthy diet
              </div>
            </div>
          </section>

          <section className="ingredients-section">
            <div className="section-header">
              <h3>Popular Ingredients</h3>
            </div>
            <div className="ingredients-grid">
              <div className="ingredient-card"
                onClick={() => window.location.href = 'list'}
              >전체 레시피 확인</div>
              <div className="ingredient-card"
                onClick={()=> window.location.href = '/search/ingredient-kimchi'}>Kimchi</div>
              <div className="ingredient-card"
                onClick={()=> window.location.href = '/search/ingredient-pasta'}>Pasta</div>
              <div className="ingredient-card"
                onClick={()=> window.location.href = '/search/ingredient-bacon'}>Bacon</div>
            </div>
          </section>

          <section className="dishes-section">
            <div className="section-header">
              <h3>Explore by Cuisine</h3>
            </div>
            <div className="dishes-grid">
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-korean'}>
                🇰🇷 Korean
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-italian'}>
                🇮🇹 Italian
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-japanese'}>
                🇯🇵 Japanese
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-chinese'}>
                🇨🇳 Chinese
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-mexican'}>
                🇲🇽 Mexican
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-french'}>
                🇫🇷 French
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-indian'}>
                🇮🇳 Indian
              </div>
              <div className="dish-card" onClick={() => window.location.href = '/search/cuisine-thai'}>
                🇹🇭 Thai
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}