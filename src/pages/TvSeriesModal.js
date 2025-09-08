import React from 'react';
import './EventsModal.css'; 

const TvSeriesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="events-modal-overlay" onClick={onClose}>
      <div className="events-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="events-modal-header">
          <div className="events-modal-gif">
            <img 
              src="/image/Sorry.gif" 
              alt="Sorry" 
              className="sorry-gif"
            />
          </div>
        </div>
        
        <div className="events-modal-body">
          <div className="events-modal-decoration"></div>
          <h2>Sorry this page is not available yet</h2>
          <p className="events-modal-description">
            We're working hard to bring you this feature.
          </p>
        </div>

        <div className="events-modal-separator"></div>
        
        <div className="events-modal-footer">
          <button className="events-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TvSeriesModal;
