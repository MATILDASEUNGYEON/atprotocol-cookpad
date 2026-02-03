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
  
  const getAuthorInitials = (handle: string) => {
    return handle.split('.')[0].substring(0, 2).toUpperCase()
  }
  
  return (
    <div className="recipe-detail-header">
      <h1 className="recipe-title">{title}</h1>
      
      {status && (
        <span className="recipe-status">{status}</span>
      )}

      <div className="recipe-author">
        <div className="user-menu-header">
          <div className="user-menu-avatar">
            {author.avatar ? (
              <img src={author.avatar} alt={author.handle} />
            ) : (
              <span>{getAuthorInitials(author.handle)}</span>
            )}
          </div>
          <div className="user-menu-info">
            <div className="user-menu-name">
              {author.displayName || author.handle.split('.')[0] || 'User'}
            </div>
            <div className="user-menu-handle">@{author.handle}</div>
          </div>
        </div>    

      </div>

      <div className="recipe-description">
        <p>{description}</p>
      </div>
    </div>
  )
}
