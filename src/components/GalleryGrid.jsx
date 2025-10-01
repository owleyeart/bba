// src/components/GalleryGrid.jsx
// Bob Baker - October 2025

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const GalleryGrid = ({ 
  images, 
  pagination, 
  onImageClick, 
  onPageChange, 
  loading, 
  apiBase 
}) => {
  const navigate = useNavigate();
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

  const handleItemClick = (item, index) => {
    if (item.type === 'collection') {
      // Navigate to the collection view
      navigate(`/gallery/${item.id}`);
    } else {
      // Open lightbox for individual image
      onImageClick(index);
    }
  };

  if (loading && !images.length) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!images.length) {
    return (
      <div className="empty-state">
        <p>No results found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="image-grid">
        {images.map((item, index) => {
          // Render collection card
          if (item.type === 'collection') {
            return (
              <div 
                key={item.id} 
                className="collection-card-result"
                onClick={() => handleItemClick(item, index)}
              >
                <div className="collection-card-content">
                  <div className="collection-icon">
                    📁
                  </div>
                  <h3 className="collection-title">{item.displayName || item.name}</h3>
                  <div className="collection-info">
                    <span className="collection-count">{item.itemCount} photos</span>
                    {item.date && (
                      <span className="collection-date">{formatDate(item.date)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Render individual image thumbnail
          return (
            <div 
              key={item.id} 
              className="image-card-result"
              onClick={() => handleItemClick(item, index)}
            >
              {loadingImages.has(item.id) && (
                <div className="image-loading">
                  <div className="spinner"></div>
                </div>
              )}
              
              {failedImages.has(item.id) ? (
                <div className="image-error">
                  <span>Failed to load</span>
                </div>
              ) : (
                <img
                  src={`${apiBase}/images/${item.id}?size=medium&quality=85`}
                  alt={item.displayName || item.name}
                  loading="lazy"
                  onLoadStart={() => handleImageStartLoad(item.id)}
                  onLoad={() => handleImageLoad(item.id)}
                  onError={() => handleImageError(item.id)}
                />
              )}
              
              <div className="image-info">
                <div className="image-filename">{item.name}</div>
                {item.collectionName && (
                  <div className="image-collection">
                    📁 {item.collectionName.replace(/^\d{8}\s*/, '')}
                  </div>
                )}
                {!item.collectionName && item.dateTaken && (
                  <div className="image-date">{formatDate(item.dateTaken)}</div>
                )}
              </div>
            </div>
          );
        })}
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
              <span> • {pagination.totalImages} results</span>
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
          <LoadingSpinner message="Loading..." />
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
