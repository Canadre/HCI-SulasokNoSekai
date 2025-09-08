import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import "./SplashPage.css";



const SplashAnime = () => {
  const [isLoaded, setIsLoaded] = useState(false);

   const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

   const handleEnterApp = () => {
    navigate("/home"); // 👈 goes to HomePage
  };

  return (
    <div className="splash-container">
      {/* Left Side - Content */}
      <div className="left-section">
        {/* Background subtle animation */}
        <div className="bg-animation"></div>
        
        <div className={`content-wrapper ${isLoaded ? 'loaded' : ''}`}>
          {/* Logo/Brand */}
          <div className="brand-section">
            <div className="brand-label">
              DOWN ANIVERSE
            </div>
            <h1 className="main-title">
              <span className="title-line">Discover</span>
              <span className="title-line">the anime</span>
              <span className="title-line gradient-text">world</span>
            </h1>
          </div>  

          {/* Tagline */}
          <p className="tagline">
            For those who seek adventure, there will always be stories that feel like home.
          </p>

          {/* Enter Button */}
          <button
            onClick={handleEnterApp}
            className="enter-button"
            aria-label="Start watching anime"
          >
            <Play className="play-icon" />
            <span>START WATCHING</span>
            <ArrowRight className="arrow-icon" />
          </button>

          {/* Decorative elements */}
          <div className="decoration-circle-1"></div>
          <div className="decoration-circle-2"></div>
        </div>
      </div>

      {/* Right Side - Anime Image */}
      <div className="right-section">
        {/* Anime Background Image */}
        <div className="anime-background"></div>
        
        {/* ENHANCED GRADIENT OVERLAYS - ADD THESE LINES */}
        <div className="gradient-overlay"></div>
        <div className="blend-layer"></div>
        
        {/* Floating elements */}
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
        
        {/* Sparkles */}
        <div className="sparkle sparkle-1">
          <svg className="sparkle-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
          </svg>
        </div>
        <div className="sparkle sparkle-2">
          <svg className="sparkle-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
          </svg>
        </div>

        {/* Content overlay */}
        <div className="image-overlay">
          <div className="overlay-content">
            <p className="overlay-subtitle">Featured Anime</p>
            <p className="overlay-title">Studio Collection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashAnime;