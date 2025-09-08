import React from 'react';
import { X } from 'lucide-react';
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
          <button className="about-modal-close" onClick={onClose}>
            <X />
          </button>
        </div>
        
        <div className="about-modal-content">
          <div className="about-section">
            <h3>Welcome to DOWN ANIVERSE</h3>
            <p>
              Your ultimate destination for anime streaming and discovery. We provide 
              a comprehensive platform for anime enthusiasts to explore, watch, and 
              enjoy their favorite series and movies.
            </p>
          </div>

          <div className="about-section">
            <h3>Features</h3>
            <ul>
              <li>Extensive anime library with subbed and dubbed content</li>
              <li>Advanced search and filtering options</li>
              <li>Genre-based browsing</li>
              <li>Popular and trending anime recommendations</li>
              <li>Movies, TV series, OVAs, and specials</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Version</h3>
            <p>DOWN ANIVERSE v1.0.0</p>
          </div>

          <div className="about-section">
            <h3>Contact</h3>
            <p>
              For support or feedback, please reach out to our team. 
              We're always looking to improve your anime viewing experience.
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