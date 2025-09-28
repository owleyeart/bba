// src/Gallery.jsx
// Bob Baker - September 2025
// SharePoint-powered photo gallery

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GalleryGrid from './components/GalleryGrid';
import GalleryList from './components/GalleryList';
import SearchBar from './components/SearchBar';
import Lightbox from './components/Lightbox';
import LoadingSpinner from './components/LoadingSpinner';
import './Gallery.css';

const Gallery = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  
  const [galleries, setGalleries] = useState([]);
  const [currentGallery, setCurrentGallery] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    hasNext: false,
    hasPrev: false
  });

  const API_BASE = process.env.REACT_APP_API_URL || 'https://bba-production-6aed.up.railway.app/api';

  useEffect(() => {
    loadGalleries();
  }, []);

  useEffect(() => {
    if (galleryId) {
      loadGalleryImages(galleryId);
    } else {
      setCurrentGallery(null);
      setImages([]);
      setSearchResults(null);
    }
  }, [galleryId]);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/galleries`);
      if (!response.ok) throw new Error('Failed to load galleries');
      
      const data = await response.json();
      setGalleries(data);
    } catch (err) {
      setError('Failed to load galleries. Please try again.');
      console.error('Error loading galleries:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGalleryImages = async (id, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const gallery = galleries.find(g => g.id === id);
      setCurrentGallery(gallery);
      
      const response = await fetch(
        `${API_BASE}/galleries/${id}/images?page=${page}&limit=20&sortBy=date&sortOrder=desc`
      );
      
      if (!response.ok) throw new Error('Failed to load images');
      
      const data = await response.json();
      setImages(data.images);
      setPagination(data.pagination);
      setSearchResults(null);
    } catch (err) {
      setError('Failed to load gallery images. Please try again.');
      console.error('Error loading gallery images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    try {
      setIsSearching(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        q: searchParams.query || '',
        page: searchParams.page || 1,
        limit: 20,
        ...(searchParams.startDate && { startDate: searchParams.startDate }),
        ...(searchParams.endDate && { endDate: searchParams.endDate }),
        ...(searchParams.galleries?.length && { galleries: searchParams.galleries.join(',') })
      });

      const response = await fetch(`${API_BASE}/search?${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data);
      setCurrentGallery(null);
      
      // Update URL to reflect search
      if (searchParams.query || searchParams.startDate || searchParams.endDate) {
        navigate('/gallery/search');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setCurrentGallery(null);
    setImages([]);
    navigate('/gallery');
  };

  const openLightbox = (imageIndex) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    const currentImages = searchResults?.images || images;
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % currentImages.length
      : (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    
    setCurrentImageIndex(newIndex);
  };

  const handlePageChange = (newPage) => {
    if (searchResults) {
      handleSearch({ ...searchResults.lastQuery, page: newPage });
    } else if (currentGallery) {
      loadGalleryImages(currentGallery.id, newPage);
    }
  };

  const currentImages = searchResults?.images || images;
  const currentPagination = searchResults?.pagination || pagination;

  if (loading && !currentImages.length) {
    return (
      <div className="gallery-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Header with search */}
      <div className="gallery-header">
        <div className="gallery-title-section">
          {searchResults ? (
            <div className="search-results-header">
              <h1>Search Results</h1>
              <button className="clear-search-btn" onClick={clearSearch}>
                ← Back to Galleries
              </button>
            </div>
          ) : currentGallery ? (
            <div className="gallery-title-header">
              <button 
                className="back-btn" 
                onClick={() => navigate('/gallery')}
              >
                ← Back to Galleries
              </button>
              <h1>{currentGallery.displayName}</h1>
              <p className="gallery-date">
                {currentGallery.date && new Date(currentGallery.date).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <h1>Photo Galleries</h1>
          )}
        </div>
        
        <SearchBar 
          onSearch={handleSearch} 
          galleries={galleries}
          isSearching={isSearching}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Main content */}
      <div className="gallery-content">
        {!currentGallery && !searchResults ? (
          // Gallery list view
          <GalleryList 
            galleries={galleries} 
            onGallerySelect={(id) => navigate(`/gallery/${id}`)}
          />
        ) : (
          // Image grid view
          <GalleryGrid 
            images={currentImages}
            pagination={currentPagination}
            onImageClick={openLightbox}
            onPageChange={handlePageChange}
            loading={loading || isSearching}
            apiBase={API_BASE}
          />
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImages.length > 0 && (
        <Lightbox
          image={currentImages[currentImageIndex]}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNext={() => navigateLightbox('next')}
          onPrev={() => navigateLightbox('prev')}
          hasNext={currentImageIndex < currentImages.length - 1}
          hasPrev={currentImageIndex > 0}
          apiBase={API_BASE}
        />
      )}
    </div>
  );
};

export default Gallery;