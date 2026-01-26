'use client'

import { useState } from 'react'
import Image from 'next/image'
import logo from '../assets/main-logo.png'

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  return (
    <div className="home-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Image src={logo} alt="Cookpad Logo" width={24} height={24} />
            {sidebarOpen && <span className="logo-text">cookpad</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item">
            <span className="nav-icon">🔍</span>
            {sidebarOpen && <span>Search</span>}
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⭐</span>
            {sidebarOpen && <span>Premium</span>}
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🏆</span>
            {sidebarOpen && <span>Challenges</span>}
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🌍</span>
            {sidebarOpen && <span>Region</span>}
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📚</span>
            {sidebarOpen && <span>Your Collection</span>}
          </a>
        </nav>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        {/* 상단 헤더 */}
        <header className="top-header">
          <div className="header-logo">
            <Image src={logo} alt="Cookpad Logo" width={36} height={36} />
            <span className="logo-text-large">cookpad</span>
          </div>
          <div className="header-actions">
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            <button className="create-recipe-btn">
              + Create a recipe
            </button>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
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
              {/* 카테고리 카드들이 들어갈 공간 */}
              <div className="category-placeholder">Category items will go here</div>
            </div>
          </section>

          <section className="ingredients-section">
            <div className="section-header">
              <h3>Popular Ingredients</h3>
              <span className="update-time">Updated 9:02 PM</span>
            </div>
            <div className="ingredients-grid">
              {/* 인기 재료 카드들이 들어갈 공간 */}
              <div className="ingredient-card">Salmon</div>
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
              {/* 인기 요리 카드들이 들어갈 공간 */}
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