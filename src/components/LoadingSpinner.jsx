// src/components/LoadingSpinner.jsx
// Bob Baker - September 2025

import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingSpinner;