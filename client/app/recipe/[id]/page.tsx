'use client'

import { useState, useEffect, Suspense } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import RecipeDetailHeader from '@/components/RecipeDetailHeader'
import RecipeDetailActions from '@/components/RecipeDetailActions'
import RecipeIngredientsDisplay from '@/components/RecipeIngredientsDisplay'
import RecipeStepsDisplay from '@/components/RecipeStepsDisplay'
import { useAuth } from '@/hooks/useAuth'
import '../../styles/recipe-detail.css'
import { ClipLoader } from 'react-spinners'

interface RecipeDetailPageProps {
  params: { id: string }
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const router = useRouter()
  const { userInfo, isLoggedIn, isLoading: authLoading } = useAuth()

  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true)
        const response = await fetch(`/api/recipe/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) notFound()
          throw new Error('Failed to fetch recipe')
        }

        const data = await response.json()
        
        const normalizedSteps = Array.isArray(data.steps)
          ? data.steps.map((step: any) => ({
              id: step.id || crypto.randomUUID(),
              description: step.description || step.text || '',
              image: step.image || null
            }))
          : []

        setRecipe({
          ...data,
          steps: normalizedSteps
        })
        setIsLiked(data.isLiked || false)
        setIsSaved(data.isBookmarked || false)
        setLikesCount(data.likesCount || 0)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  if (loading || authLoading) {
    return (
      <div className="home-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="profile-container loading">
            <ClipLoader size={36} color="#ff6b35" />
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) notFound()

  const isOwner = Boolean(
    isLoggedIn &&
    userInfo?.did &&
    recipe.author_did === userInfo.did
  )

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleSave = () => setIsSaved(!isSaved)
  const handleAddToFolder = () => console.log('Add to folder')
  const handleShare = () => console.log('Share recipe')
  const handleEdit = () => router.push(`/recipe/${params.id}/edit`)
  
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 레시피를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/recipe/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`삭제 실패: ${error.error || '알 수 없는 오류'}`)
        return
      }

      const result = await response.json()
      alert('레시피가 성공적으로 삭제되었습니다.')
      
      window.location.href = '/profile'
    } catch (error) {
      console.error('Delete failed:', error)
      alert('레시피 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <div className="recipe-detail-back-button">
          <button className="back-button" onClick={() => window.location.href = '/list'}>
              <span className="back-icon">←</span>
              <span className="back-text">Back to previous page</span>
          </button>
        </div>
        <main className="content-area">
          
          <div className="recipe-detail-layout">
            <div className="recipe-left-column">
              <div className="recipe-detail-image">
                {recipe.thumbnail_url ? (
                  <Image
                    src={recipe.thumbnail_url}
                    alt={recipe.title}
                    width={600}
                    height={450}
                    priority
                  />
                ) : (
                  <div className="image-placeholder">🍳 No Image</div>
                )}
              </div>

              <RecipeIngredientsDisplay
                serves={recipe.servings || 1}
                ingredients={recipe.ingredients || []}
              />
            </div>

            <div className="recipe-right-column">
              <RecipeDetailHeader
                title={recipe.title}
                description={recipe.description || ''}
                author={{
                  handle: recipe.author_profile?.handle || recipe.author_did.split(':').pop() || 'user',
                  displayName: recipe.author_profile?.displayName || 'User',
                  avatar: recipe.author_profile?.avatar
                }}
                status="Published"
              />

              <RecipeDetailActions
                isOwner={isOwner}
                isLoggedIn={isLoggedIn}
                isLiked={isLiked}
                isSaved={isSaved}
                likesCount={likesCount}
                onLike={handleLike}
                onSave={handleSave}
                onAddToFolder={handleAddToFolder}
                onShare={handleShare}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />

              <RecipeStepsDisplay
                cookTimeMinutes={recipe.cook_time_minutes || 0}
                steps={recipe.steps || []}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
