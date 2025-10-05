// src/components/SearchBar.jsx
// Bob Baker - October 2025

import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, galleries, isSearching }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    startDate: '',
    endDate: '',
    year: [],
    month: [],
    orientation: 'any',
    collectionsOnly: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Get unique years from galleries for filter options
  const [availableYears, setAvailableYears] = useState([]);
  
  useEffect(() => {
    // Extract unique years from galleries
    const years = new Set();
    galleries.forEach(gallery => {
      if (gallery.date) {
        const year = new Date(gallery.date).getFullYear();
        years.add(year.toString());
      }
    });
    setAvailableYears(Array.from(years).sort((a, b) => b - a));
  }, [galleries]);

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const handleInputChange = (field, value) => {
    const newParams = {
      ...searchParams,
      [field]: value
    };
    setSearchParams(newParams);
    
    // Trigger search on the fly for advanced filters
    if (field !== 'query') {
      onSearch({
        ...newParams,
        page: 1
      });
    }
  };
  
  const handleArrayToggle = (field, value) => {
    const currentArray = searchParams[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    const newParams = {
      ...searchParams,
      [field]: newArray
    };
    setSearchParams(newParams);
    
    // Trigger search on the fly
    onSearch({
      ...newParams,
      page: 1
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...searchParams,
      page: 1 // Reset to first page on new search
    });
  };

  const clearSearch = () => {
    const clearedParams = {
      query: '',
      startDate: '',
      endDate: '',
      year: [],
      month: [],
      orientation: 'any',
      collectionsOnly: false
    };
    setSearchParams(clearedParams);
    onSearch({
      ...clearedParams,
      page: 1
    });
  };

  const hasActiveSearch = searchParams.query || 
                         searchParams.startDate || 
                         searchParams.endDate || 
                         searchParams.year.length > 0 ||
                         searchParams.month.length > 0 ||
                         searchParams.orientation !== 'any' ||
                         searchParams.collectionsOnly;

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          <div className="search-field">
            <label htmlFor="search-query">Search</label>
            <input
              id="search-query"
              type="text"
              placeholder="Search by filename, event, or date..."
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
              Clear Filters
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
            {/* Collections Only */}
            <div className="filter-section">
              <label className="checkbox-label collections-checkbox">
                <input
                  type="checkbox"
                  checked={searchParams.collectionsOnly}
                  onChange={(e) => handleInputChange('collectionsOnly', e.target.checked)}
                />
                <span className="checkbox-text">
                  <strong>Collections Only</strong> - Show only event folders
                </span>
              </label>
            </div>
            
            {/* Year Filter */}
            {availableYears.length > 0 && (
              <div className="filter-section">
                <label className="filter-label">Year</label>
                <div className="filter-checkboxes">
                  {availableYears.map(year => (
                    <label key={year} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={searchParams.year.includes(year)}
                        onChange={() => handleArrayToggle('year', year)}
                      />
                      <span className="checkbox-text">{year}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Month Filter */}
            <div className="filter-section">
              <label className="filter-label">Month</label>
              <div className="filter-checkboxes month-grid">
                {months.map(month => (
                  <label key={month.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={searchParams.month.includes(month.value)}
                      onChange={() => handleArrayToggle('month', month.value)}
                    />
                    <span className="checkbox-text">{month.label}</span>
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
