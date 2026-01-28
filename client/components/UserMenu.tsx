'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import '../app/styles/UserMenu.css'

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export default function UserMenu({ isOpen, onClose, onLogout }: UserMenuProps) {
  const { userInfo, getInitials } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleMenuClick = (path: string) => {
    onClose()
    if (path === 'logout') {
      onLogout()
    } else {
      window.location.href = path
    }
  }

  return (
    <div className="user-menu-dropdown" ref={menuRef}>
      <div className="user-menu-header">
        <div className="user-menu-avatar">
          <span>{userInfo ? getInitials(userInfo.handle) : 'U'}</span>
        </div>
        <div className="user-menu-info">
          <div className="user-menu-name">
            {userInfo?.displayName || userInfo?.handle.split('.')[0] || 'User'}
          </div>
          <div className="user-menu-handle">@{userInfo?.handle || 'user'}</div>
        </div>
      </div>

      <div className="user-menu-divider" />

      <div className="user-menu-items">
        <button 
          className="user-menu-item"
          onClick={() => handleMenuClick('/profile')}
        >
          <span className="menu-icon">👤</span>
          <span>Profile</span>
        </button>

        <button 
          className="user-menu-item"
          onClick={() => handleMenuClick('/settings')}
        >
          <span className="menu-icon">⚙️</span>
          <span>Settings</span>
        </button>

        <button 
          className="user-menu-item"
          onClick={() => handleMenuClick('/region')}
        >
          <span className="menu-icon">🌐</span>
          <span>Region</span>
        </button>

        <button 
          className="user-menu-item"
          onClick={() => handleMenuClick('/feedback')}
        >
          <span className="menu-icon">✉️</span>
          <span>Send Feedback</span>
        </button>
      </div>

      <div className="user-menu-divider" />

      <button 
        className="user-menu-item logout-item"
        onClick={() => handleMenuClick('logout')}
      >
        <span className="menu-icon">🚪</span>
        <span>Log out</span>
      </button>
    </div>
  )
}
