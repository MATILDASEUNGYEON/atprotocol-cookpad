import {Suspense} from 'react'
import RecipeList from '@/components/RecipeList'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'

const APPVIEW_API = process.env.NEXT_PUBLIC_APPVIEW_URL || 'http://localhost:1212'

export default async function listPage() {
  try {
    const response = await fetch(`${APPVIEW_API}/api/recipes?limit=100`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch recipes from AppView:', response.status)
      return (
        <div className="home-layout">
          <Sidebar />
          <div className="main-content">
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
            </Suspense>
            <main className="content-area">
              <RecipeList recipes={[]} />
            </main>
          </div>
        </div>
      )
    }
    
    const data = await response.json()
    const recipes = data.recipes || []
    

    return (
      <div className="home-layout">
        <Sidebar />
        <div className="main-content">
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>
          <main className="content-area">
            <div className="list-header">
              <h1>전체 레시피</h1>
              <p className="list-description">
                ATProtocol 기반 분산형 레시피 네트워크의 모든 레시피를 확인하세요
              </p>
            </div>
            <RecipeList recipes={recipes} />
          </main>
        </div>
      </div>
    ) 
  } catch (error) {
    console.error('❌ Error fetching recipes from AppView:', error)
    return (
      <div className="home-layout">
        <Sidebar />
        <div className="main-content">
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>
          <main className="content-area">
            <RecipeList recipes={[]} />
          </main>
        </div>
      </div>
    )
  }
}