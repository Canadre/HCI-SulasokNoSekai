import React from 'react';
import { Library, Search, Compass, TrendingUp, Star, Users } from 'lucide-react';
import './AboutPage.css';

const AboutPage = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="about-modal-overlay" onClick={handleOverlayClick}>
      <div className="about-modal">
        <div className="about-modal-header">
          <h2>About DOWN ANIVERSE</h2>
        </div>
        
        <div className="about-modal-content">
          <div className="about-section">
            <div className="section-header">
              <Star className="section-icon" />
              <h3>Welcome to DOWN ANIVERSE</h3>
            </div>
            <p>
              Your ultimate destination for anime streaming and discovery. We provide 
              a comprehensive platform for anime enthusiasts to explore, watch, and 
              enjoy their favorite series and movies.
            </p>
          </div>

          <div className="about-section">
            <div className="section-header">
              <Compass className="section-icon" />
              <h3>Features</h3>
            </div>
            <ul className="features-list">
              <li className="feature-item">
                <Library className="feature-icon" />
                <span>Extensive anime library with subbed and dubbed content</span>
              </li>
              <li className="feature-item">
                <Search className="feature-icon" />
                <span>Advanced search and filtering options</span>
              </li>
              <li className="feature-item">
                <Compass className="feature-icon" />
                <span>Genre-based browsing and discovery</span>
              </li>
              <li className="feature-item">
                <TrendingUp className="feature-icon" />
                <span>Popular and trending anime recommendations</span>
              </li>
            </ul>
          </div>

          <div className="about-section">
            <div className="section-header">
              <div className="version-badge">v1.0.0</div>
              <h3>Version</h3>
            </div>
            <p>DOWN ANIVERSE v1.0.0 - Built with passion for the anime community</p>
          </div>

          <div className="about-section">
            <div className="section-header">
              <Users className="section-icon" />
              <h3>Contact & Support</h3>
            </div>
            <p>
              For support or feedback, please reach out to our team. 
              We're always looking to improve your anime viewing experience and 
              welcome suggestions from our community.
            </p>
          </div>
        </div>

        <div className="about-modal-footer">
          <button className="about-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;