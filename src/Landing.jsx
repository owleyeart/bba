import React, { useState, useRef, useEffect } from 'react';

import './styles/Landing.css';

const images = [
  '/images/landing/20220301_303_IMG_1121.jpg',
  '/images/landing/20250823_303_OWL7329.jpg',
  '/images/landing/20250823_303_OWL7388.jpg',
  '/images/landing/20240725_303_OWL9909.jpg',
  '/images/landing/20250429_303_OWL6695.jpg',
  '/images/landing/20240725_303_OWL9897.jpg',
  '/images/landing/20240704_303_OWL8744.jpg',
  '/images/landing/20240627_303_OWL8355.jpg',
];

const Landing = ({ isMenuOpen }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPosX, setBgPosX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [initialPosX, setInitialPosX] = useState(50);
  const [dragDirection, setDragDirection] = useState('none');
  const [fadeClass, setFadeClass] = useState('');
  const [controlsVisible, setControlsVisible] = useState(false);

  const DRAG_DIRECTION_THRESHOLD = 20;
  const VERTICAL_SWIPE_THRESHOLD = 50;
  const SCROLL_COOLDOWN = 500;

  const hideTimerRef = useRef(null);
  const lastWheelTimeRef = useRef(0);

  function showControls() {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 900);
  }

  useEffect(() => {
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 900);
    return () => clearTimeout(hideTimerRef.current);
  }, []);

  const triggerFade = (updateFn) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      updateFn();
      setFadeClass('fade-in');
      setTimeout(() => setFadeClass(''), 1000);
    }, 300);
  };

  // Pre-load adjacent images
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    // Pre-load next and previous images
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    
    preloadImage(images[nextIndex]);
    preloadImage(images[prevIndex]);
  }, [currentIndex]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        showControls();
        const now = Date.now();
        if (now - lastWheelTimeRef.current < SCROLL_COOLDOWN) return;
        lastWheelTimeRef.current = now;

        triggerFade(() =>
          setCurrentIndex((prev) =>
            e.key === 'ArrowDown' 
              ? (prev + 1) % images.length 
              : (prev - 1 + images.length) % images.length
          )
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWheel = (e) => {
    showControls();
    const now = Date.now();
    if (now - lastWheelTimeRef.current < SCROLL_COOLDOWN) return;
    lastWheelTimeRef.current = now;

    triggerFade(() =>
      setCurrentIndex((prev) =>
        e.deltaY > 0 ? (prev + 1) % images.length : (prev - 1 + images.length) % images.length
      )
    );
  };

  const handlePointerDown = (e) => {
    showControls();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setInitialPosX(bgPosX);
    setDragDirection('none');
  };

  const handlePointerMove = (e) => {
    showControls();
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (isDragging) {
      if (dragDirection === 'none') {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD) {
          setDragDirection('horizontal');
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD) {
          setDragDirection('vertical');
        }
      }

      if (dragDirection === 'horizontal') {
        const newPosX = initialPosX + (deltaX / containerWidth) * 100;
        setBgPosX(Math.max(0, Math.min(100, newPosX)));
      }
    } else {
      const ratio = e.clientX / containerWidth;
      setBgPosX(Math.max(0, Math.min(100, ratio * 100)));
    }
  };

  const handlePointerUpOrLeave = (e) => {
    showControls();
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDirection === 'vertical') {
      const deltaY = e.clientY - startY;
      if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
        triggerFade(() =>
          setCurrentIndex((prev) =>
            deltaY < 0 ? (prev - 1 + images.length) % images.length : (prev + 1) % images.length
          )
        );
      }
    }
    setDragDirection('none');
  };

  return (
    <div
      className={`landing-container ${currentIndex === 0 ? 'first-block' : ''}`}
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundPosition: `${bgPosX}% center`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
      }}
    >
      {/* Intro Card */}
      <div className={`landing-intro-card ${currentIndex === 0 ? 'centered' : 'bottom'}`}>
        <div className="intro-card-content">
          <h1 className="intro-name">Bob Baker</h1>
          {currentIndex === 0 && (
            <>
              <p className="intro-title">Experimental Photographer</p>
              <div className="intro-divider">—</div>
            </>
          )}
          <div className="intro-buttons">
            <button 
              className="intro-search-button"
              onClick={() => window.location.href = '/gallery'}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Search the Gallery</span>
            </button>
            <button 
              className="intro-search-button"
              onClick={() => window.location.href = '/news'}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                <path d="M18 14h-8"></path>
                <path d="M15 18h-5"></path>
                <path d="M10 6h8v4h-8V6Z"></path>
              </svg>
              <span>News</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
