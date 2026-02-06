'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const params = useSearchParams()
  const error = params?.get('error')

  return (
    <div className="container">
      <h1>🔄 OAuth 인증 결과</h1>

      <div className="result error">
        <h3>❌ 로그인 실패</h3>
        <p>{error ? decodeURIComponent(error) : '알 수 없는 오류가 발생했습니다.'}</p>
        <Link href="/login" className="back-button">
          다시 시도하기
        </Link>
      </div>
    </div>
  )
}

export default function CallbackErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
