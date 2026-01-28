'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import logo from '../assets/main-logo.png'

interface HeaderProps {
  onLoginClick?: () => void
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ did: string; handle: string } | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim())
      const didCookie = cookies.find(cookie => cookie.startsWith('did='))
      
      if (didCookie) {
        const did = didCookie.split('=')[1]
        const storedHandle = localStorage.getItem('userHandle')
        setIsLoggedIn(true)
        setUserInfo({ did, handle: storedHandle || 'user' })
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
      }
    }

    const loginSuccess = searchParams?.get('login')
    const handle = searchParams?.get('handle')
    const did = searchParams?.get('did')
    
    if (loginSuccess === 'success' && handle && did) {
      localStorage.setItem('userHandle', handle)
      
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      document.cookie = `did=${did}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
      
      setIsLoggedIn(true)
      setUserInfo({ did, handle })
      
      window.history.replaceState({}, '', '/')
    } else {
      checkLoginStatus()
    }
  }, [searchParams])

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick()
    } else {
      window.location.href = '/login'
    }
  }

  const handleLogout = () => {
    document.cookie = 'did=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('userHandle')
    setIsLoggedIn(false)
    setUserInfo(null)
    window.location.href = '/'
  }

  const handleCreateRecipe = () => {
    if (!isLoggedIn) {
      alert('Please login to create a recipe')
      handleLogin()
      return
    }
    window.location.href = '/upload'
  }

  return (
    <header className="top-header">
      <div className="header-logo">
        <Image src={logo} alt="Cookpad Logo" width={36} height={36} />
        <span className="logo-text-large">cookpad</span>
      </div>
      <div className="header-actions">
        {!isLoggedIn ? (
          <>
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            <button className="create-recipe-btn" onClick={handleCreateRecipe}>
              + Create a recipe
            </button>
          </>
        ) : (
          <>
            <button className="create-recipe-btn" onClick={handleCreateRecipe}>
              + Create a recipe
            </button>
            <div className="user-menu">
              <div className="user-info">
                <span className="user-icon">👤</span>
                <span className="user-handle">@{userInfo?.handle}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
