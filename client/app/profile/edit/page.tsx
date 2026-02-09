'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import '../../styles/profile-edit.css'

export default function ProfileEditPage() {
  const router = useRouter()
  const { userInfo, getInitials, updateUserInfo } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    cookpadId: '',
    location: '',
    bio: '',
  })

  useEffect(() => {
    if (!userInfo) return

    setFormData({
      name: userInfo.displayName || userInfo.handle.split('.')[0] || '',
      cookpadId: userInfo.handle || '',
      location: localStorage.getItem('userLocation') || '',
      bio: localStorage.getItem('userBio') || '',
    })
  }, [userInfo])

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Update failed')
      }

      if (formData.location) localStorage.setItem('userLocation', formData.location)
      if (formData.bio) localStorage.setItem('userBio', formData.bio)

      updateUserInfo({
        displayName: formData.name,
      })

      alert('프로필이 업데이트되었습니다.')
      
      router.push('/profile')
    } catch (err) {
      console.error('프로필 업데이트 실패:', err)
      alert(err instanceof Error ? err.message : '프로필 업데이트에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>

        <div className="profile-edit-container">
          <button className="back-button" onClick={handleCancel}>
            ←
          </button>

          <div className="edit-form">
            <div className="avatar-section">
              <div className="edit-avatar">
                <span>{userInfo ? getInitials(userInfo.handle) : 'U'}</span>
                <div className="avatar-edit-icons">
                  <button className="avatar-edit-btn" title="Change Photo">
                    📷
                  </button>
                  <button className="avatar-edit-btn" title="Delete Photo">
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bluesky ID</label>
              <input
                type="text"
                className="form-input"
                value={`@${formData.cookpadId}`}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                About you and your love of cooking
              </label>
              <textarea
                className="form-textarea"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Bio"
                rows={1}
              />
            </div>

            <div className="form-actions">
              <button
                className="update-btn"
                onClick={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? '업데이트 중...' : 'Update'}
              </button>

              <button
                className="cancel-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
