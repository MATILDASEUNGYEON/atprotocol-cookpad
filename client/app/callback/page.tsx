'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function CallbackContent() {
  const params = useSearchParams()

  const success = params?.get('success')
  const did = params?.get('did')
  const handle = params?.get('handle')
  const error = params?.get('error')

  return (
    <div className="container">
      <h1>🔄 OAuth 인증 결과</h1>

      {success === 'true' && (
        <div className="result success">
          <h3>✅ 로그인 성공</h3>
          <pre>{JSON.stringify({ did, handle }, null, 2)}</pre>
          <Link href="/" className="back-button">
            메인으로 돌아가기
          </Link>
        </div>
      )}

      {error && (
        <div className="result error">
          <h3>❌ 로그인 실패</h3>
          <p>{decodeURIComponent(error)}</p>
          <Link href="/" className="back-button">
            다시 시도하기
          </Link>
        </div>
      )}
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  )
}