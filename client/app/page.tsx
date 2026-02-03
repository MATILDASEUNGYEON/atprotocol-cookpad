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
            <h3>Quick & Easy</h3>
            <div className="category-grid">
              <div className="category-placeholder">Category items will go here</div>
            </div>
          </section>

          <section className="ingredients-section">
            <div className="section-header">
              <h3>Popular Ingredients</h3>
              <span className="update-time">Updated 9:02 PM</span>
            </div>
            <div className="ingredients-grid">
              <div className="ingredient-card"
                onClick={() => window.location.href = 'list'}
              >전체 레시피 확인</div>
              <div className="ingredient-card">Chicken Breast</div>
              <div className="ingredient-card">Pork Chops</div>
              <div className="ingredient-card">Bacon</div>
            </div>
          </section>

          <section className="dishes-section">
            <div className="section-header">
              <h3>Popular Dishes</h3>
              <span className="update-time">Updated 8:51 PM</span>
            </div>
            <div className="dishes-grid">
              <div className="dish-card">Soup</div>
              <div className="dish-card">Chili</div>
              <div className="dish-card">Homemade Bread</div>
              <div className="dish-card">Egg Noodle Soup</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}