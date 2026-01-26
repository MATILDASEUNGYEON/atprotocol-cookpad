import { useState } from 'react'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      window.location.href = data.redirectUrl
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🦋 Bluesky 로그인</h1>
      <p className="subtitle">AT Protocol API 테스트_vite</p>

      <form onSubmit={onSubmit}>
        <label>Bluesky Handle</label>
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="user.bsky.social"
          required
        />

        <button disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </button>
      </form>

      {error && (
        <div className="result error">
          <h3>❌ 로그인 실패</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
