import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/reels.css";
import BottomNav from "../../components/BottomNav";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    const stored = localStorage.getItem("savedVideos");
    return stored ? JSON.parse(stored) : [];
  });

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


  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/food", { withCredentials: true })
  //     .then((response) => {
  //       const foodItems = response.data.foodItems || [];
  //       const withLikes = foodItems.map((item) => ({
  //         ...item,
  //         likeCount: item.likes ?? 0,
  //         liked: false,
  //       }));
  //       setVideos(withLikes);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching videos", err);
  //     });
  // }, []);

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((vId) => vId !== id);
      } else {
        next = [...prev, id];
      }
      localStorage.setItem("savedVideos", JSON.stringify(next));
      return next;
    });
  };


useEffect(() => {
  axios
    .get("http://localhost:3000/api/food", { withCredentials: true })
    .then((response) => {

      console.log(response.data)
      const foodItems = response.data.foodItems || [];
      const likedVideos = response.data.likedVideos || [];
      
      const withLikes = foodItems.map((item) => ({
        ...item,
        likeCount: item.likeCount ?? 0,
        liked: likedVideos.includes(item._id),
      }));
      setVideos(withLikes);
    })
    .catch((err) => {
      console.error("Error fetching videos", err);
    });
}, []);

const toggleLike = async (id) => {
  const currentVideo = videos.find(v => v._id === id);
  
  setVideos((prev) =>
    prev.map((item) => {
      if (item._id !== id) return item;

      const newLiked = !item.liked;
      let newCount = item.likeCount + (newLiked ? 1 : -1);
      if (newCount < 0) newCount = 0;

      return {
        ...item,
        liked: newLiked,
        likeCount: newCount,
      };
    })
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
          <h1>Video</h1>
        </header>

        <main className="phone-main" ref={scrollRef}>
          <div className="reels-feed" role="list">
            {videos.map((item) => {
              const isSaved = savedIds.includes(item._id);
              const likes = item.likeCount < 0 ? 0 : item.likeCount;
              const comments = item.comments ?? 0;
              const saves = item.saves ?? 0;

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

                  <div className="reel-overlay">
                    <div className="reel-description-block">
                      <p
                        className="reel-description"
                        title={item.description}
                      >
                        {item.description || "description"}
                      </p>
                      <Link
                        className="visit-store-btn"
                        to={`/food-partner/${item.foodPartner}`}
                        aria-label="Visit store"
                      >
                        visit store
                      </Link>
                    </div>

                    <div className="reel-actions">
                 
                      <button
                        type="button"
                        className={`icon-btn ${item.liked ? "icon-btn-active" : ""}`}
                        aria-label="Likes"
                        onClick={() => toggleLike(item._id)}
                      >
                        <span className="icon">
                          {item.liked ? "❤️" : "♡"}
                        </span>
                        <span className="icon-text">likes: {likes}</span>
                      </button>

               
                      <button
                        type="button"
                        className={`icon-btn ${isSaved ? "icon-btn-active" : ""}`}
                        onClick={() => toggleSave(item._id)}
                        aria-label="Save video"
                      >
                        <span className="icon">🔖</span>
                        <span className="icon-text">
                          Save: {saves + (isSaved ? 1 : 0)}
                        </span>
                      </button>

                      {/* COMMENT BUTTON */}
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Comments"
                      >
                        <span className="icon">💬</span>
                        <span className="icon-text">
                          Comment: {comments}
                        </span>
                      </button>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        <BottomNav active="home" />
      </div>
    </div>
  );
};

export default Home;