import React, { useState, useEffect } from 'react';
import { X, LogOut, Heart } from 'lucide-react';
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
    // After 3 seconds, redirect to splash page
    setTimeout(() => {
      onExit();
    }, 3000);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="exit-modal-overlay" onClick={handleOverlayClick}>
      <div className="exit-modal">
        {!showThankYou ? (
          // Confirmation Screen
          <>
            <div className="exit-modal-header">
              <h2>Confirm Exit</h2>
              <button className="exit-modal-close" onClick={onClose}>
                <X />
              </button>
            </div>
            
            <div className="exit-modal-content">
              <div className="exit-icon-container">
                <LogOut className="exit-icon" />
              </div>
              <div className="exit-message">
                <h3>Are you sure you want to exit?</h3>
                <p>You will be redirected to the main page.</p>
              </div>
            </div>

            <div className="exit-modal-footer">
              <button className="exit-modal-button cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="exit-modal-button confirm" onClick={handleConfirmExit}>
                Yes, Exit
              </button>
            </div>
          </>
        ) : (
          // Thank You Screen
          <>
            <div className="exit-modal-header">
              <h2>Thank You!</h2>
            </div>
            
            <div className="exit-modal-content thank-you-content">
              <div className="thank-you-icon-container">
                <Heart className="thank-you-icon" />
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