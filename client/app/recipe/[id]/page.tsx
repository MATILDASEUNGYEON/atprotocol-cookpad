'use client'

import { useState, Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import RecipeDetailHeader from '@/components/RecipeDetailHeader'
import RecipeDetailActions from '@/components/RecipeDetailActions'
import RecipeIngredientsDisplay from '@/components/RecipeIngredientsDisplay'
import RecipeStepsDisplay from '@/components/RecipeStepsDisplay'
import '../../styles/recipe-detail.css'

// Mock data - 나중에 실제 API로 교체
const getMockRecipe = (id: string) => {
  return {
    uri: `at://did:plc:123/app.bookhive.recipe/${id}`,
    title: 'Pasta Recipe! Quick, easy & incredibly delicious',
    description: 'Complete recipe - just search for 🤪 Culinates 71 on YouTube',
    thumbnailUrl: '/mock/pasta.jpg',
    cookTimeMinutes: 35,
    serves: 3,
    ingredients: [
      { id: '1', type: 'ingredient' as const, name: '50 g salted lard' },
      { id: '2', type: 'ingredient' as const, name: '1 onion' },
      { id: '3', type: 'ingredient' as const, name: '150 g carrots' },
      { id: '4', type: 'ingredient' as const, name: '4 eggs' },
      { id: '5', type: 'ingredient' as const, name: '2 g pepper' },
      { id: '6', type: 'ingredient' as const, name: '1 tsp burger seasoning' },
      { id: '7', type: 'ingredient' as const, name: '1 tsp paprika powder' },
      { id: '8', type: 'ingredient' as const, name: '0.25 tsp coriander' },
      { id: '9', type: 'ingredient' as const, name: '1 tsp basil' },
      { id: '10', type: 'ingredient' as const, name: '30 g cream' },
      { id: '11', type: 'ingredient' as const, name: '1 pinch chili powder' },
      { id: '12', type: 'ingredient' as const, name: '200 g feta cheese' },
      { id: '13', type: 'ingredient' as const, name: '3 hand mixer' },
      { id: '14', type: 'ingredient' as const, name: '5 g parsley, dill' },
      { id: '15', type: 'ingredient' as const, name: '300-400 g pre-cooked pasta' },
    ],
    steps: [
      {
        id: '1',
        description: 'First, cut the lard into cubes and fry for 5 minutes.',
        image: new File([], '/mock/step1.jpg')
      },
      {
        id: '2',
        description: 'Then add a diced onion and fry for another 5 minutes.',
        image: new File([], '/mock/step2.jpg')
      },
      {
        id: '3',
        description: 'Next, add the carrots and simmer, covered, over low heat for 10 minutes.',
        image: new File([], '/mock/step3.jpg')
      },
      {
        id: '4',
        description: 'Crack the eggs into a bowl and add the spices.',
        image: new File([], '/mock/step4.jpg')
      },
      {
        id: '5',
        description: 'Crumble the feta cheese into a bowl and mix it with a fork.',
        image: undefined
      },
    ],
    author: {
      handle: 'culinates_english',
      displayName: 'English',
      did: 'did:plc:123',
      avatar: undefined
    },
    likesCount: 1,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString()
  }
}

interface RecipeDetailPageProps {
  params: { id: string }
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipe = getMockRecipe(params.id)
  
  if (!recipe) {
    notFound()
  }

  const [isLiked, setIsLiked] = useState(recipe.isLiked)
  const [isSaved, setIsSaved] = useState(recipe.isBookmarked)
  const [likesCount, setLikesCount] = useState(recipe.likesCount)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleAddToFolder = () => {
    console.log('Add to folder')
  }

  const handleShare = () => {
    console.log('Share recipe')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='home-layout'>
      <Sidebar />

      <div className='main-content'>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>

        <main className='content-area'>
          <div className='recipe-detail-layout'>
            {/* Left Column */}
            <div className='recipe-left-column'>
              {/* Recipe Image */}
              <div className='recipe-detail-image'>
                {recipe.thumbnailUrl ? (
                  <Image
                    src={recipe.thumbnailUrl}
                    alt={recipe.title}
                    width={600}
                    height={450}
                    priority
                  />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>

              {/* Ingredients */}
              <RecipeIngredientsDisplay
                serves={recipe.serves}
                ingredients={recipe.ingredients}
              />
            </div>

            {/* Right Column */}
            <div className='recipe-right-column'>
              {/* Header */}
              <RecipeDetailHeader
                title={recipe.title}
                description={recipe.description}
                author={recipe.author}
                status="Mich reached"
              />

              {/* Actions */}
              <RecipeDetailActions
                isLiked={isLiked}
                isSaved={isSaved}
                likesCount={likesCount}
                onLike={handleLike}
                onSave={handleSave}
                onAddToFolder={handleAddToFolder}
                onShare={handleShare}
                onPrint={handlePrint}
              />

              {/* Steps */}
              <RecipeStepsDisplay
                cookTimeMinutes={recipe.cookTimeMinutes}
                steps={recipe.steps}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
