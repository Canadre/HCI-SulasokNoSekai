import React, { useState, useEffect } from 'react';
import './ExitModal.css';

const ExitModal = ({ isOpen, onClose, onExit }) => {
  const [showThankYou, setShowThankYou] = useState(false);

  // Reset to confirmation screen when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowThankYou(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowThankYou(true);
    
    setTimeout(() => {
      onExit();
    }, 5000);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="exit-modal-overlay" onClick={handleOverlayClick}>
      <div className="exit-modal">
        {!showThankYou ? (
          // Confirmation Screen section
          <>
            <div className="exit-modal-header">
              <h2>Confirm Exit</h2>
            </div>
            
            <div className="exit-modal-content">
              <div className="exit-icon-container">
                <img 
                  src="/image/aqua.gif" 
                  alt="Aqua" 
                  className="exit-gif"
                />
              </div>
              <div className="exit-message">
                <h3>Are you sure you want to leave?</h3>
                <p>You will be redirected to the Intro page.</p>
              </div>
            </div>

            <div className="exit-modal-footer">
              <button className="exit-modal-button confirm" onClick={handleConfirmExit}>
                Yes, Leave
              </button>
              <button className="exit-modal-button cancel" onClick={handleCancel}>
                No, I'll Stay
              </button>
            </div>
          </>
        ) : (
          // Thank You Screen section
          <>
            <div className="exit-modal-header">
              <h2>Arigato!</h2>
            </div>
            
            <div className="exit-modal-content thank-you-content">
              <div className="thank-you-icon-container">
                <img 
                  src="/image/bye.gif" 
                  alt="Goodbye" 
                  className="thank-you-gif"
                />
              </div>
              <div className="thank-you-message">
                <h3>Thank you for using and visiting</h3>
                <h2 className="brand-name">DOWN ANIVERSE</h2>
                <p>We hope you enjoyed your anime experience!</p>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitModal;