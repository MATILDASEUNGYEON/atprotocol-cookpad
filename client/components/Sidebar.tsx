'use client'

import { useState } from 'react'
import Image from 'next/image'
import logo from '../assets/main-logo.png'

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <a href="/" className="sidebar-logo">
          <Image src={logo} alt="Cookpad Logo" width={24} height={24} />
          {sidebarOpen && <span className="logo-text">cookpad</span>}
        </a>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {sidebarOpen ? '«' : '»'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <a href="/" className="nav-item">
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
  )
}
