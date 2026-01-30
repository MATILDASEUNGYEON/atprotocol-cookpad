'use client'

interface RecipeDetailActionsProps {
  isLiked: boolean
  isSaved: boolean
  likesCount: number
  onLike: () => void
  onSave: () => void
  onAddToFolder: () => void
  onShare: () => void
  onDelete: () => void
}

export default function RecipeDetailActions({
  isLiked,
  isSaved,
  likesCount,
  onLike,
  onSave,
  onAddToFolder,
  onShare,
  onDelete
}: RecipeDetailActionsProps) {
  return (
    <div className="recipe-detail-actions">
      <div className="top-actions">
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={onLike}
        >
          <span className="icon">❤️</span>
          <span className="count">{likesCount}</span>
        </button>
        
        <button className="action-btn" onClick={onShare}>
          <span className="icon">📤</span>
          <span className="count">1</span>
        </button>
      </div>

      <div className="main-actions">
        <button 
          className={`main-action-btn save-btn ${isSaved ? 'saved' : ''}`}
          onClick={onSave}
        >
          <span className="icon">📑</span>
          Save Recipe
        </button>

        <button 
          className="main-action-btn folder-btn"
          onClick={onAddToFolder}
        >
          <span className="icon">📁</span>
          Add to folders
        </button>

        <button 
          className="main-action-btn share-btn"
          onClick={onShare}
        >
          <span className="icon">📤</span>
          Share
        </button>

        <button 
          className="main-action-btn delete-btn"
          onClick={onDelete}
        >
          <span className="icon">🗑</span>
          Delete
        </button>
      </div>
    </div>
  )
}
