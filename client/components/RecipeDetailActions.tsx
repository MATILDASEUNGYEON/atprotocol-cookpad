'use client'

interface RecipeDetailActionsProps {
  isOwner: boolean
  isLoggedIn: boolean
  isLiked: boolean
  isSaved: boolean
  likesCount: number
  onLike: () => void
  onSave: () => void
  onAddToFolder: () => void
  onShare: () => void
  onDelete: () => void
  onEdit: () => void
}

export default function RecipeDetailActions({
  isOwner,
  isLoggedIn,
  isLiked,
  isSaved,
  likesCount,
  onLike,
  onSave,
  onAddToFolder,
  onShare,
  onDelete,
  onEdit
}: RecipeDetailActionsProps) {
  return (
    <div className="recipe-detail-actions">
      <div className="top-actions">
        <button
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={onLike}
          disabled={!isLoggedIn}
        >
          ❤️ <span className="count">{likesCount}</span>
        </button>

        <button className="action-btn" onClick={onShare}>
          📤
        </button>
      </div>

      <div className="main-actions">
        {isOwner ? (
          <>
            <button className="main-action-btn edit-btn" onClick={onEdit}>
              ✏️ Edit recipe
            </button>

            <button
              className="main-action-btn folder-btn"
              onClick={onAddToFolder}
            >
              📁 Add to folders
            </button>

            <button
              className="main-action-btn share-btn"
              onClick={onShare}
            >
              📤 Share
            </button>

            <button
              className="main-action-btn delete-btn"
              onClick={onDelete}
            >
              🗑 Delete
            </button>
          </>
        ) : (
          <>
            <button
              className={`main-action-btn save-btn ${isSaved ? 'saved' : ''}`}
              onClick={onSave}
              disabled={!isLoggedIn}
            >
              📑 Save Recipe
            </button>

            <button
              className="main-action-btn folder-btn"
              onClick={onAddToFolder}
              disabled={!isLoggedIn}
            >
              📁 Add to folders
            </button>

            <button
              className="main-action-btn share-btn"
              onClick={onShare}
            >
              📤 Share
            </button>

            <button className="main-action-btn report-btn">
              🚨 Report
            </button>
          </>
        )}
      </div>
    </div>
  )
}
