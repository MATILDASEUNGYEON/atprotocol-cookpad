'use client'

import { useState, useEffect, Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import RecipeDetailHeader from '@/components/RecipeDetailHeader'
import RecipeDetailActions from '@/components/RecipeDetailActions'
import RecipeIngredientsDisplay from '@/components/RecipeIngredientsDisplay'
import RecipeStepsDisplay from '@/components/RecipeStepsDisplay'
import { useAuth } from '@/hooks/useAuth'
import '../../styles/recipe-detail.css'

interface RecipeDetailPageProps {
  params: { id: string }
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
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
        setRecipe(data)
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
          <div className="loading-state">로딩 중...</div>
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
      
      // 홈 페이지로 리다이렉트
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
                  handle: recipe.author_did.split(':').pop() || 'user',
                  displayName: 'User',
                  avatar: undefined
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
