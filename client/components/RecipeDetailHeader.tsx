'use client'

import Image from 'next/image'

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
  return (
    <div className="recipe-detail-header">
      <h1 className="recipe-title">{title}</h1>
      
      {status && (
        <span className="recipe-status">{status}</span>
      )}

      {/* Author info */}
      <div className="recipe-author">
        <div className="author-avatar">
          {author.avatar ? (
            <Image 
              src={author.avatar} 
              alt={author.handle}
              width={40}
              height={40}
            />
          ) : (
            <div className="avatar-placeholder">
              {author.handle[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="author-info">
          <div className="author-name">
            Culinates <span className="author-handle">"{author.displayName || author.handle}"</span> <span className="handle-id">@{author.handle}</span>
          </div>
          <div className="author-meta">@ USA</div>
        </div>
      </div>

      {/* Recipe description */}
      <div className="recipe-description">
        <p>{description}</p>
        <button className="read-more">Read more</button>
      </div>
    </div>
  )
}
