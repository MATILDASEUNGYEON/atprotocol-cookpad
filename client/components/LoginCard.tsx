'use client'

import { useState } from 'react'
import Image from 'next/image'
import logo from '../assets/main-logo.png'

export default function LoginCard() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!handle.trim()) {
      alert('Please enter your Bluesky handle')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: handle }),
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
    <div className="login-card">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>

        <div className="header-logo">
            <Image src={logo} alt="Cookpad Logo" width={60} height={60} style={{ width: '100%', height: 'auto' }} />
            <span className="logo-text-large">cookpad</span>
          </div>
      </div>

      <h1 className="title">Sign Up or Log In</h1>

      <form onSubmit={onSubmit}>
        <label className="label" htmlFor="identifier">Bluesky Handle</label>
        <input
          type="text"
          className="input"
          id="identifier"
          placeholder="user.bsky.social"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          disabled={loading}
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="signup">
        Don&apos;t have an account?{' '}
        <a
          href="https://bsky.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign up for Bluesky
        </a>
      </p>
    </div>
  )
}