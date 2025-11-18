import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {  Link } from "react-router-dom";
import "../../styles/reels.css";


const Home = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  
  // Helper to store refs mapped by ID
  const setVideoRef = (id) => (el) => {
    if (el) videoRefs.current.set(id, el);
  };

  useEffect(() => {
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
      { threshold: 0.6 } // play only when 60% visible
    );

    // Observe all videos
    videoRefs.current.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
   axios.get("http://localhost:3000/api/food", {
  withCredentials: true
})
.then(response => {
  setVideos(response.data.foodItems);
});
    },[]); 



  return (
    <div
      ref={containerRef} className="reels-page">
        <div className="reels-feed" role="list">
      {videos.map((item) => (
        <section key={item._id} className="reel" role="listItem">
        
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
            <div className="reel-overlay-gradient" aria-hidden="true"/>
            <div  className="reel-content">
                <p className="reel-description" title={item.description}>{item.description}</p>
                <Link className="reel-btn" to={"/food-partner/" + item.foodPartner} aria-label= "Visit store">Visit store</Link>
            </div>
          </div>
        </section>
      ))}
    </div>
    </div>
  );
};

export default Home;


