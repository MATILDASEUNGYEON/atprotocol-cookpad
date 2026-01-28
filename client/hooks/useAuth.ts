'use client'

import { useState, useEffect } from 'react'

export interface UserInfo {
  did: string
  handle: string
  displayName?: string
  avatar?: string
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim())
      const didCookie = cookies.find(cookie => cookie.startsWith('did='))
      
      if (didCookie) {
        const did = didCookie.split('=')[1]
        const storedHandle = localStorage.getItem('userHandle')
        const storedDisplayName = localStorage.getItem('userDisplayName')
        const storedAvatar = localStorage.getItem('userAvatar')
        
        setIsLoggedIn(true)
        setUserInfo({
          did,
          handle: storedHandle || 'user',
          displayName: storedDisplayName || undefined,
          avatar: storedAvatar || undefined
        })
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
      }
      
      setIsLoading(false)
    }

    checkLoginStatus()

    // URL에서 로그인 정보 확인 (OAuth 콜백 후)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const loginSuccess = params.get('login')
      const handle = params.get('handle')
      const did = params.get('did')
      
      if (loginSuccess === 'success' && handle && did) {
        localStorage.setItem('userHandle', handle)
        
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        document.cookie = `did=${did}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
        
        setIsLoggedIn(true)
        setUserInfo({ did, handle })
        setIsLoading(false)
        
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  const logout = () => {
    document.cookie = 'did=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('userHandle')
    localStorage.removeItem('userDisplayName')
    localStorage.removeItem('userAvatar')
    setIsLoggedIn(false)
    setUserInfo(null)
  }

  const getInitials = (handle: string) => {
    if (!handle) return 'U'
    
    // handle이 @로 시작하면 제거
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle
    
    // handle에서 첫 두 글자를 대문자로
    const parts = cleanHandle.split('.')
    if (parts.length > 0) {
      const firstPart = parts[0]
      return firstPart.slice(0, 2).toUpperCase()
    }
    
    return cleanHandle.slice(0, 2).toUpperCase()
  }

  return {
    isLoggedIn,
    userInfo,
    isLoading,
    logout,
    getInitials
  }
}
