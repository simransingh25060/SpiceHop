import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/reels.css";
import BottomNav from "../../components/BottomNav";

const Save = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map());
  const scrollRef = useRef(null);

  const setVideoRef = (id) => (el) => {
    if (el) videoRefs.current.set(id, el);
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedVideos");
    const savedIds = saved ? JSON.parse(saved) : [];

    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        const all = response.data.foodItems || [];
        const filtered = all.filter((v) => savedIds.includes(v._id));
        setVideos(filtered);
      })
      .catch((err) => {
        console.error("Error fetching videos", err);
      });
  }, []);

  return (
    <div className="reels-page">
      <div className="phone-frame">
        <header className="phone-header">
          <h1>Saved</h1>
        </header>

        <main className="phone-main" ref={scrollRef}>
          {videos.length === 0 ? (
            <div className="empty-state">
              <p>No saved videos yet.</p>
            </div>
          ) : (
            <div className="reels-feed" role="list">
              {videos.map((item) => (
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
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <BottomNav active="saved" />
      </div>
    </div>
  );
};

export default Save;
