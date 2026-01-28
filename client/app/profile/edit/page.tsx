'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import '../../styles/profile-edit.css'

export default function ProfileEditPage() {
  const router = useRouter()
  const { userInfo, getInitials } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    cookpadId: '',
    location: '',
    bio: ''
  })

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.displayName || userInfo.handle.split('.')[0] || '',
        cookpadId: userInfo.handle || '',
        location: '',
        bio: ''
      })
    }
  }, [userInfo])

  const handleUpdate = () => {
    if (formData.name) {
      localStorage.setItem('userDisplayName', formData.name)
    }
    if (formData.location) {
      localStorage.setItem('userLocation', formData.location)
    }
    if (formData.bio) {
      localStorage.setItem('userBio', formData.bio)
    }
    
    // TODO: API 연동
    console.log('Update profile:', formData)
    alert('프로필이 업데이트되었습니다.')
    
    window.location.href = '/profile'
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  return (
    <div className='home-layout'>
      <Sidebar />

      <div className='main-content'>
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
                    <span>📷</span>
                  </button>
                  <button className="avatar-edit-btn" title="Delete Photo">
                    <span>🗑️</span>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bluesky ID</label>
              <div className="input-with-action">
                <input
                  type="text"
                  className="form-input"
                  value={`@${formData.cookpadId}`}
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location"
              />
            </div>

            <div className="form-group">
              <label className="form-label">About you and your love of cooking</label>
              <textarea
                className="form-textarea"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Bio"
                rows={1}
              />
            </div>

            <div className="form-actions">
              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
