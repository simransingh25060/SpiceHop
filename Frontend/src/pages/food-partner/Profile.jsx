import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import '../../styles/user-profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [isOwnProfile, setIsOwnProfile] = useState(false)

    useEffect(() => {
        // If no id param, it's the logged-in partner's own profile
        if (!id) {
            // Fetch own profile
            axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/me`, { withCredentials: true })
                .then(response => {
                    setProfile(response.data.foodPartner)
                    setVideos(response.data.foodPartner.foodItems || [])
                    setIsOwnProfile(true)
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Error fetching own profile:', error)
                    setLoading(false)
                })
        } else {
            // Fetch other partner's profile
            axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/${id}`, { withCredentials: true })
                .then(response => {
                    setProfile(response.data.foodPartner)
                    setVideos(response.data.foodPartner.foodItems || [])
                    setIsOwnProfile(false)
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Error fetching profile:', error)
                    setLoading(false)
                })
        }
    }, [id])

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/logout`,
                {},
                { withCredentials: true }
            )
            navigate('/food-partner/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    if (loading) {
        return (
            <div className="reels-page">
                <div className="phone-frame">
                    <div className="user-loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="reels-page">
            <div className="phone-frame">
                <header className="phone-header">
                    <div className="header-content">
                        <h1 className="brand-name">{isOwnProfile ? 'My Profile' : 'Partner Profile'}</h1>
                    </div>
                </header>

                <main className="phone-main">
                    <div className="user-profile-container">
                        <div className="user-profile-header">
                            <div className="user-avatar">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h2 className="user-name">{profile?.name || 'Partner'}</h2>
                            <p className="user-email">{profile?.email}</p>
                            {profile?.address && (
                                <p className="user-email" style={{ marginTop: '4px' }}>
                                    📍 {profile.address}
                                </p>
                            )}
                        </div>

                        <div className="user-stats">
                            <div className="user-stat-item">
                                <span className="stat-value">{videos.length || 0}</span>
                                <span className="stat-label">Recipes</span>
                            </div>
                            <div className="user-stat-item">
                                <span className="stat-value">{profile?.totalMeals || 0}</span>
                                <span className="stat-label">Total Meals</span>
                            </div>
                        </div>

                        {isOwnProfile ? (
                            <>
                                <div className="user-menu">
                                    <button 
                                        className="user-menu-item"
                                        onClick={() => navigate('/create-food')}
                                    >
                                        <span className="menu-icon">➕</span>
                                        <span className="menu-text">Create New Recipe</span>
                                        <span className="menu-arrow">›</span>
                                    </button>

                                    <button className="user-menu-item">
                                        <span className="menu-icon">👤</span>
                                        <span className="menu-text">Edit Profile</span>
                                        <span className="menu-arrow">›</span>
                                    </button>

                                    <button className="user-menu-item">
                                        <span className="menu-icon">⚙️</span>
                                        <span className="menu-text">Settings</span>
                                        <span className="menu-arrow">›</span>
                                    </button>

                                    <button className="user-menu-item">
                                        <span className="menu-icon">📊</span>
                                        <span className="menu-text">Analytics</span>
                                        <span className="menu-arrow">›</span>
                                    </button>

                                    <button className="user-menu-item">
                                        <span className="menu-icon">❓</span>
                                        <span className="menu-text">Help & Support</span>
                                        <span className="menu-arrow">›</span>
                                    </button>
                                </div>

                                <button className="user-btn user-btn-logout" onClick={handleLogout}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    <span>Log Out</span>
                                </button>
                            </>
                        ) : null}

                        {videos.length > 0 && (
                            <>
                                <div style={{ 
                                    padding: '20px 20px 12px', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: 'rgba(255,255,255,0.8)',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    marginTop: '12px'
                                }}>
                                    Posted Recipes ({videos.length})
                                </div>
                                <section className="profile-grid" aria-label="Videos">
                                    {videos.map((v) => (
                                        <div key={v._id} className="profile-grid-item">
                                            <video
                                                className="profile-grid-video"
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                src={v.video} 
                                                muted
                                            />
                                        </div>
                                    ))}
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Profile