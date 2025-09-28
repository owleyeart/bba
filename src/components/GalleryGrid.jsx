// src/components/GalleryGrid.jsx
// Bob Baker - September 2025

import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const GalleryGrid = ({ 
  images, 
  pagination, 
  onImageClick, 
  onPageChange, 
  loading, 
  apiBase 
}) => {
  const [loadingImages, setLoadingImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageLoad = (imageId) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleImageError = (imageId) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
    setFailedImages(prev => new Set(prev).add(imageId));
  };

  const handleImageStartLoad = (imageId) => {
    setLoadingImages(prev => new Set(prev).add(imageId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading && !images.length) {
    return <LoadingSpinner message="Loading images..." />;
  }

  if (!images.length) {
    return (
      <div className="empty-state">
        <p>No images found in this gallery.</p>
      </div>
    );
  }

  return (
    <>
      <div className="image-grid">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="image-card"
            onClick={() => onImageClick(index)}
          >
            {loadingImages.has(image.id) && (
              <div className="image-loading">
                <div className="spinner"></div>
              </div>
            )}
            
            {failedImages.has(image.id) ? (
              <div className="image-error">
                <span>Failed to load</span>
              </div>
            ) : (
              <img
                src={`${apiBase}/images/${image.id}?size=medium&quality=85`}
                alt={image.displayName || image.name}
                loading="lazy"
                onLoadStart={() => handleImageStartLoad(image.id)}
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageError(image.id)}
              />
            )}
            
            <div className="image-overlay">
              <h4 className="image-title">
                {image.displayName || image.name}
              </h4>
              <div className="image-meta">
                {image.dateTaken && (
                  <span>{formatDate(image.dateTaken)}</span>
                )}
                {image.size && (
                  <span>{formatFileSize(image.size)}</span>
                )}
                {image.width && image.height && (
                  <span>{image.width} × {image.height}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev || loading}
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            {pagination.totalImages && (
              <span> • {pagination.totalImages} images</span>
            )}
          </div>
          
          <button
            className="pagination-button"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext || loading}
          >
            Next →
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner message="Loading more images..." />
        </div>
      )}
    </>
  );
};

export default GalleryGrid;