// src/components/SearchBar.jsx
// Bob Baker - September 2025

import React, { useState } from 'react';

const SearchBar = ({ onSearch, galleries, isSearching }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    startDate: '',
    endDate: '',
    galleries: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...searchParams,
      page: 1 // Reset to first page on new search
    });
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      startDate: '',
      endDate: '',
      galleries: []
    });
    onSearch({
      query: '',
      startDate: '',
      endDate: '',
      galleries: [],
      page: 1
    });
  };

  const hasActiveSearch = searchParams.query || 
                         searchParams.startDate || 
                         searchParams.endDate || 
                         searchParams.galleries.length > 0;

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          <div className="search-field">
            <label htmlFor="search-query">Search</label>
            <input
              id="search-query"
              type="text"
              placeholder="Search by filename, camera, lens..."
              value={searchParams.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="start-date">From Date</label>
            <input
              id="start-date"
              type="date"
              value={searchParams.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="end-date">To Date</label>
            <input
              id="end-date"
              type="date"
              value={searchParams.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={searchParams.startDate || undefined}
            />
          </div>
        </div>
        
        <div className="search-actions">
          <button
            type="submit"
            className="search-button"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="search-spinner"></span>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
          
          {hasActiveSearch && (
            <button
              type="button"
              className="clear-button"
              onClick={clearSearch}
              disabled={isSearching}
            >
              Clear
            </button>
          )}
        </div>
      </form>
      
      {/* Advanced filters */}
      <div className="advanced-filters">
        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
        
        {showAdvanced && (
          <div className="filter-content">
            <div className="search-field">
              <label>Filter by Galleries</label>
              <div className="gallery-checkboxes">
                {galleries.map(gallery => (
                  <label key={gallery.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={searchParams.galleries.includes(gallery.id)}
                      onChange={(e) => {
                        const newGalleries = e.target.checked
                          ? [...searchParams.galleries, gallery.id]
                          : searchParams.galleries.filter(id => id !== gallery.id);
                        handleInputChange('galleries', newGalleries);
                      }}
                    />
                    <span className="checkbox-text">
                      {gallery.displayName || gallery.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;