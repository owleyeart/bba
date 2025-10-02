// src/components/GalleryList.jsx
// Bob Baker - September 2025

import React from 'react';

const GalleryList = ({ galleries, onGallerySelect }) => {
  const API_BASE = import.meta.env.VITE_API_URL || 'https://bba-production-6aed.up.railway.app/api';
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return '';
    }
  };

  if (!galleries.length) {
    return (
      <div className="empty-state">
        <h2>No galleries available</h2>
        <p>Check back later for new photo collections.</p>
      </div>
    );
  }

  return (
    <div className="galleries-container">
      {galleries.map((gallery) => (
        <div
          key={gallery.id}
          className="gallery-card"
          onClick={() => onGallerySelect(gallery.id)}
        >
          {gallery.thumbnailUrl && (
            <div className="gallery-card-thumbnail">
              <img 
                src={`${API_BASE}/image/${gallery.thumbnailId}`} 
                alt={gallery.displayName}
                loading="lazy"
              />
            </div>
          )}
          
          <div className="gallery-card-content">
            <div className="gallery-card-header">
              <h3>{gallery.displayName || gallery.name}</h3>
              {gallery.date && (
                <div className="gallery-date-badge">
                  {formatDate(gallery.date)}
                </div>
              )}
            </div>
            
            <div className="gallery-stats">
              <div className="gallery-stat">
                <span>📷</span>
                <span>{gallery.itemCount || 0} photos</span>
              </div>
              
              {gallery.lastModified && (
                <div className="gallery-stat">
                  <span>🕒</span>
                  <span>{getTimeAgo(gallery.lastModified)}</span>
                </div>
              )}
            </div>

            {gallery.description && (
              <p className="gallery-description">
                {gallery.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryList;