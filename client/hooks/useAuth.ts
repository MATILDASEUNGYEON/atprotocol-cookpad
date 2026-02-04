'use client'

import { useState, useEffect } from 'react'
import { UserInfo } from '../types/auth'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim())
      const didCookie = cookies.find(cookie => cookie.startsWith('did='))
      
      if (didCookie) {
        const did = didCookie.split('=')[1]
        const storedHandle = localStorage.getItem('userHandle')
        
        setIsLoggedIn(true)
        setUserInfo({
          did,
          handle: storedHandle || 'user',
          displayName: localStorage.getItem('userDisplayName') || undefined,
          avatar: localStorage.getItem('userAvatar') || undefined
        })
        setIsLoading(false)

        try {
          const res = await fetch('/api/me')
          if (res.ok) {
            const profile = await res.json()
            
            if (profile.displayName) {
              localStorage.setItem('userDisplayName', profile.displayName)
            }
            if (profile.description) {
              localStorage.setItem('userBio', profile.description)
            }
            if (profile.avatar) {
              localStorage.setItem('userAvatar', profile.avatar)
            }
            
            setUserInfo({
              did,
              handle: profile.handle || storedHandle || 'user',
              displayName: profile.displayName || undefined,
              avatar: profile.avatar || undefined
            })
          }
        } catch (err) {
          console.error('프로필 정보 가져오기 실패:', err)
        }
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
        setIsLoading(false)
      }
    }

    checkLoginStatus()

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const loginSuccess = params.get('login')
      const handle = params.get('handle')
      const did = params.get('did')
      const displayName = params.get('displayName')
      const avatar = params.get('avatar')
      
      if (loginSuccess === 'success' && handle && did) {
        localStorage.setItem('userHandle', handle)
        if (displayName) {
          localStorage.setItem('userDisplayName', displayName)
        }
        if (avatar) {
          localStorage.setItem('userAvatar', avatar)
        }
        
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        document.cookie = `did=${did}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
        
        setIsLoggedIn(true)
        setUserInfo({ 
          did, 
          handle,
          displayName: displayName || undefined,
          avatar: avatar || undefined
        })
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
    
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle
    
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
