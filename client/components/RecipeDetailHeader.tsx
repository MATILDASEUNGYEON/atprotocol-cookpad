'use client'

import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
interface RecipeDetailHeaderProps {
  title: string
  description: string
  author: {
    handle: string
    displayName?: string
    avatar?: string
  }
  status?: string
}

export default function RecipeDetailHeader({
  title,
  description,
  author,
  status
}: RecipeDetailHeaderProps) {
  const { userInfo, getInitials } = useAuth()
  return (
    <div className="recipe-detail-header">
      <h1 className="recipe-title">{title}</h1>
      
      {status && (
        <span className="recipe-status">{status}</span>
      )}

      <div className="recipe-author">
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

      </div>

      <div className="recipe-description">
        <p>{description}</p>
      </div>
    </div>
  )
}
