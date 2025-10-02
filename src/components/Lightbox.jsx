// src/components/Lightbox.jsx
// Bob Baker - September 2025

import React, { useEffect, useState } from 'react';
import './Lightbox.css';

const Lightbox = ({ 
  image, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev, 
  apiBase 
}) => {
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isOpen && image) {
      loadMetadata();
      setImageLoading(true);
    }
  }, [image, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
        case 'i':
        case 'I':
          setShowInfo(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  const loadMetadata = async () => {
    try {
      setLoadingMetadata(true);
      const response = await fetch(`${apiBase}/images/${image.id}/metadata`);
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
    } finally {
      setLoadingMetadata(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  const formatLocation = (location) => {
    if (!location?.latitude || !location?.longitude) return null;
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lightbox-header">
          <div className="lightbox-title">
            <h3>{image.displayName || image.name}</h3>
            {image.dateTaken && (
              <span className="lightbox-date">
                {formatDate(image.dateTaken)}
              </span>
            )}
          </div>
          
          <div className="lightbox-controls">
            <button
              className="lightbox-button info-toggle"
              onClick={() => setShowInfo(!showInfo)}
              title="Toggle Info (I)"
            >
              ℹ️
            </button>
            <button
              className="lightbox-button"
              onClick={onClose}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="lightbox-image-container">
          {imageLoading && (
            <div className="lightbox-loading">
              <div className="spinner"></div>
              <span>Loading image...</span>
            </div>
          )}
          
          <img
            src={`${apiBase}/images/${image.id}?size=large&quality=95`}
            alt={image.displayName || image.name}
            className="lightbox-image"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          
          {/* Navigation arrows */}
          {hasPrev && (
            <button
              className="lightbox-nav prev"
              onClick={onPrev}
              title="Previous (←)"
            >
              ←
            </button>
          )}
          
          {hasNext && (
            <button
              className="lightbox-nav next"
              onClick={onNext}
              title="Next (→)"
            >
              →
            </button>
          )}
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="lightbox-info">
            <div className="info-header">
              <h4>Image Information</h4>
              <button
                className="info-close"
                onClick={() => setShowInfo(false)}
                title="Close Info"
              >
                ✕
              </button>
            </div>
            
            <div className="info-content">
              <div className="info-section">
                <h4>ARTIST:</h4>
                <p className="info-value artist-credit">
                  Bob Baker, © {image.dateTaken ? new Date(image.dateTaken).getFullYear() : new Date().getFullYear()}
                </p>
              </div>

              <div className="info-section">
                <h4>FILENAME:</h4>
                <p className="info-value">{image.name.replace(/\.(jpg|jpeg|png|tiff|tif)$/i, '')}</p>
              </div>

              <div className="info-section">
                <h4>Date Taken:</h4>
                <p className="info-value">{formatDate(image.dateTaken || image.lastModified)}</p>
              </div>
              
              {image.galleryId && (
                <div className="info-section">
                  <h4>Collection:</h4>
                  <button 
                    className="collection-link"
                    onClick={() => {
                      onClose();
                      window.location.href = `/gallery/${image.galleryId}`;
                    }}
                  >
                    View Collection →
                  </button>
                </div>
              )}

              {metadata?.keywords && metadata.keywords.length > 0 && (
                <div className="info-section">
                  <h4>KEYWORDS:</h4>
                  <p className="info-value keywords-list">{metadata.keywords.join(', ')}</p>
                </div>
              )}

            {metadata && (
              <>
                {/* Camera Information */}
                {(metadata.camera?.make || metadata.camera?.model || metadata.camera?.lens) && (
                  <div className="info-section">
                    <h4>Camera & Lens</h4>
                    <div className="info-grid">
                      {metadata.camera.make && (
                        <div className="info-item">
                          <span className="info-label">Make:</span>
                          <span className="info-value">{metadata.camera.make}</span>
                        </div>
                      )}
                      {metadata.camera.model && (
                        <div className="info-item">
                          <span className="info-label">Model:</span>
                          <span className="info-value">{metadata.camera.model}</span>
                        </div>
                      )}
                      {metadata.camera.lens && (
                        <div className="info-item">
                          <span className="info-label">Lens:</span>
                          <span className="info-value">{metadata.camera.lens}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shooting Settings */}
                {(metadata.settings?.focalLength || metadata.settings?.aperture || 
                  metadata.settings?.shutterSpeed || metadata.settings?.iso) && (
                  <div className="info-section">
                    <h4>Camera Settings</h4>
                    <div className="info-grid">
                      {metadata.settings.focalLength && (
                        <div className="info-item">
                          <span className="info-label">Focal Length:</span>
                          <span className="info-value">{metadata.settings.focalLength}</span>
                        </div>
                      )}
                      {metadata.settings.aperture && (
                        <div className="info-item">
                          <span className="info-label">Aperture:</span>
                          <span className="info-value">{metadata.settings.aperture}</span>
                        </div>
                      )}
                      {metadata.settings.shutterSpeed && (
                        <div className="info-item">
                          <span className="info-label">Shutter Speed:</span>
                          <span className="info-value">{metadata.settings.shutterSpeed}</span>
                        </div>
                      )}
                      {metadata.settings.iso && (
                        <div className="info-item">
                          <span className="info-label">ISO:</span>
                          <span className="info-value">{metadata.settings.iso}</span>
                        </div>
                      )}
                      {metadata.settings.flash && (
                        <div className="info-item">
                          <span className="info-label">Flash:</span>
                          <span className="info-value">{metadata.settings.flash}</span>
                        </div>
                      )}
                      {metadata.settings.whiteBalance && (
                        <div className="info-item">
                          <span className="info-label">White Balance:</span>
                          <span className="info-value">{metadata.settings.whiteBalance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Information */}
                {metadata.location && (
                  <div className="info-section">
                    <h4>Location</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Coordinates:</span>
                        <span className="info-value">{formatLocation(metadata.location)}</span>
                      </div>
                      {metadata.location.altitude && (
                        <div className="info-item">
                          <span className="info-label">Altitude:</span>
                          <span className="info-value">{metadata.location.altitude}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {loadingMetadata && (
              <div className="info-loading">
                <div className="spinner"></div>
                <span>Loading metadata...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;