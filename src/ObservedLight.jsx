///////////////////////////////////////////////////////
// Bob Baker - Owl Eye Art Institute, April 2025     //
///////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from 'react';
import './ObservedLight.css';

const TOTAL_PAGES = 42;

const ObservedLight = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);
  const touchStartX = useRef(null);

  // Auto-scroll every 9 seconds
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      handleNext();
    }, 9000);
    return () => clearInterval(autoScrollRef.current);
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  // Touch/swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX.current;
    if (delta > 50) handlePrev();
    if (delta < -50) handleNext();
  };

  return (
    <div className="observed-container">
      <h1 className="observed-header">Observed Light</h1>
      <p className="observed-description">
        A visual study of perception, presence, and the curious behavior of light when it knows it's being watched.
        <br></br><br></br>
        An exhibit by Bob Baker (more details)
      </p>

      <div
        className="slider"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={sliderRef}
      >
        <button className="arrow left" onClick={handlePrev} aria-label="Previous page">
          &#10094;
        </button>

        <img
          src={`/images/observed-light/${String(currentPage + 1).padStart(2, '0')}.jpg`}
          alt={`Observed Light page ${currentPage + 1}`}
          className="slider-image"
        />

        <button className="arrow right" onClick={handleNext} aria-label="Next page">
          &#10095;
        </button>
      </div>

      <div className="page-number">
        Page {currentPage + 1} of {TOTAL_PAGES}
      </div>
<br />
      <div className="exhibit-info">
  <strong>Images Art Gallery</strong><br />
  April 16 through May 10<br /><br />
  <strong>Opening Reception:</strong><br /> Friday, April 18, 5–8 p.m.<br />
  Historic Downtown Overland Park, Kansas
</div>

<div className="book-info">
  <h2>“Observed Light”</h2>
  <div className="book-author">a book by Bob Baker</div>
  <p className="book-details">11&quot; x 8.5&quot;, 42 pages, full color</p>
  <a
    href="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e" // replace with real link when ready
    target="_blank"
    rel="noopener noreferrer"
    className="buy-button"
  >
    Buy Book Online
  </a>
</div>



    </div>
  );
};

export default ObservedLight;
