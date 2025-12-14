import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/reels.css";
import BottomNav from "../../components/BottomNav";

const Save = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const videoRefs = useRef(new Map());
  const scrollRef = useRef(null);

  const setVideoRef = (id) => (el) => {
    if (el) videoRefs.current.set(id, el);
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.7,
        root: scrollRef.current,
      }
    );

    videoRefs.current.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        const savedVideos = response.data.savedVideos || [];
        const foodItems = response.data.foodItems || [];
        const likedVideos = response.data.likedVideos || [];
        
        setSavedIds(savedVideos);
        localStorage.setItem("savedVideos", JSON.stringify(savedVideos));
        
        const filtered = foodItems
          .filter((v) => savedVideos.includes(v._id))
          .map((item) => ({
            ...item,
            likeCount: item.likeCount ?? 0,
            liked: likedVideos.includes(item._id),
            isLikeProcessing: false,
          }));
        
        setVideos(filtered);
      })
      .catch((err) => {
        console.error("Error fetching videos", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleSave = async (id) => {
    // Optimistically update UI
    setSavedIds((prev) => {
      const next = prev.filter((vId) => vId !== id);
      localStorage.setItem("savedVideos", JSON.stringify(next));
      return next;
    });

    // Remove from videos list
    setVideos((prev) => prev.filter((v) => v._id !== id));

    // Sync with backend
    try {
      await axios.post(
        `http://localhost:3000/api/food/save`,
        { foodId: id },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error toggling save:", err);
      // Reload on error
      window.location.reload();
    }
  };

  const toggleLike = async (id) => {
    const currentVideo = videos.find(v => v._id === id);
    
    if (currentVideo?.isLikeProcessing) return;
    
    setVideos((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isLikeProcessing: true } : item
      )
    );

    try {
      const response = await axios.post(
        `http://localhost:3000/api/food/like`,
        { id },
        { withCredentials: true }
      );

      setVideos((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                liked: response.data.liked,
                likeCount: response.data.likeCount,
                isLikeProcessing: false,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
      setVideos((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                liked: currentVideo.liked,
                likeCount: currentVideo.likeCount,
                isLikeProcessing: false,
              }
            : item
        )
      );
    }
  };

  return (
    <div className="reels-page">
      <div className="phone-frame">
        <header className="phone-header">
          <div className="header-content">
            <h1 className="brand-name">Saved</h1>
          </div>
        </header>

        <main className="phone-main" ref={scrollRef}>
          {loading ? (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p className="loading-text">Loading saved recipes...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="empty-title">No Saved Recipes</p>
              <p className="empty-subtitle">Start saving recipes you love</p>
            </div>
          ) : (
            <div className="reels-feed" role="list">
              {videos.map((item) => {
                const isSaved = savedIds.includes(item._id);
                const likes = item.likeCount < 0 ? 0 : item.likeCount;

                return (
                  <section
                    key={item._id}
                    className="reel"
                    role="listitem"
                  >
                    <video
                      ref={setVideoRef(item._id)}
                      className="reel-video"
                      src={item.video}
                      playsInline
                      muted
                      loop
                      preload="metadata"
                    />

                    <div className="reel-gradient-overlay"></div>

                    <div className="reel-overlay">
                      <div className="reel-info">
                        <div className="reel-header-info">
                          <Link to={`/food-partner/${item.foodPartner?._id}`} className="chef-link">
                            <div className="chef-avatar">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                            <span className="chef-username">{item.foodPartner?.name || "Chef"}</span>
                          </Link>
                        </div>
                        
                        <div className="food-content">
                          <h3 className="food-title">{item.name || "Delicious Recipe"}</h3>
                          <p className="food-description">
                            {item.description || "A wonderful recipe to try"}
                          </p>
                        </div>
                        
                        <Link
                          className="store-button"
                          to={`/food-partner/${item.foodPartner?._id}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                          <span>Visit Store</span>
                        </Link>
                      </div>

                      <div className="reel-actions">
                        <button
                          type="button"
                          className="action-btn"
                          aria-label={item.liked ? "Unlike" : "Like"}
                          onClick={() => toggleLike(item._id)}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill={item.liked ? "#ff3b5c" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                          <span className="action-count">{likes}</span>
                        </button>

                        <button
                          type="button"
                          className="action-btn"
                          aria-label="Unsave"
                          onClick={() => toggleSave(item._id)}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="action-btn"
                          aria-label="Share"
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3"/>
                            <circle cx="6" cy="12" r="3"/>
                            <circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </main>

        <BottomNav active="saved" />
      </div>
    </div>
  );
};

export default Save;