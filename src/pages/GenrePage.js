import React from 'react';
import './GenrePage.css';

const GenrePage = ({ genre }) => {
  return (
    <div className="genre-page">
      <h1 className="placeholder-text">
        Wala pang function for <span>{genre}</span>
      </h1>
    </div>
  );
};

export default GenrePage;
