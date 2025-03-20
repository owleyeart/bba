import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Example images
const images = [
  '/images/20240907_303_OWL0880.jpg',
  '/images/20241013_303_OWL1733.jpg',
  '/images/20250304_303_OWL4767.jpg',
  '/images/20230222_303_OWL6609.jpg',
  '/images/20250304_303_OWL4775.jpg',
  '/images/20230814_303_OWL4849.jpg',
  '/images/20240701_303_OWL8456.jpg',
  '/images/20160220_303_NOV3228.jpg',
  '/images/20250303_303_OWL4733.jpg',
  '/images/20240619_303_OWL8024.jpg',
  '/images/20240907_303_OWL0886.jpg',
];

// Navigation items, now with "Home" at the top

/*
// Original opaque colors
const navItems = [
  { label: 'Home', color: '#000000' },
  { label: 'Gallery', color: '#3B0B33' },
  { label: 'Projects', color: '#481B48' },
  { label: 'About', color: '#B00B69' },
  { label: 'Contact', color: '#D4455E' },
  { label: 'Purchase', color: '#FFAD76' },
];
*/

// Semi-transparent versions
const navItems = [
  { label: 'Home',     color: 'rgba(0, 0, 0, 0.63)' },
  { label: 'Gallery',  color: 'rgba(59, 11, 51, 0.81)' },   // #3B0B33 => (59, 11, 51)
  { label: 'Projects', color: 'rgba(72, 27, 72, 0.81)' },  // #481B48 => (72, 27, 72)
  { label: 'About',    color: 'rgba(176, 11, 105, 0.72)' },// #B00B69 => (176, 11, 105)
  { label: 'Contact',  color: 'rgba(212, 69, 94, 0.81)' }, // #D4455E => (212, 69, 94)
  { label: 'Purchase', color: 'rgba(255, 173, 118, 0.72)' },// #FFAD76 => (255, 173, 118)
];




function App() {
  const containerRef = useRef(null);

  // Current image index & horizontal pan
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPosX, setBgPosX] = useState(50);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [initialPosX, setInitialPosX] = useState(50);

  // Direction lock: "none" | "horizontal" | "vertical"
  const [dragDirection, setDragDirection] = useState("none");

  // Thresholds
  const DRAG_DIRECTION_THRESHOLD = 20;
  const VERTICAL_SWIPE_THRESHOLD = 50;

  // Fade-in controls for Scroll & Pan
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef(null);

  // Show controls, then hide after 0.9s inactivity
  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // ---------------------------------
  // Hamburger Menu State
  // ---------------------------------
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // For mobile (and also desktop if user wants to close):
  const handleHamburgerClick = () => {
    showControls(); 
    // Toggle open/close
    setIsMenuOpen((prev) => !prev);
  };

  // For desktop hover-capable devices:
  const handleHamburgerMouseEnter = () => {
    // Check if device actually supports hover
    if (window.matchMedia('(hover: hover)').matches) {
      showControls();
      setIsMenuOpen(true);
    }
  };

  // ---------------------------------
  // Keyboard Arrows (Inverted Scroll)
  // ---------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        showControls();
      }
      if (e.key === 'ArrowUp') {
        prevImage();
      } else if (e.key === 'ArrowDown') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        // Pan left
        setBgPosX((prev) => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowRight') {
        // Pan right
        setBgPosX((prev) => Math.min(100, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ---------------------------------
  // Pointer Events
  // ---------------------------------
  const handlePointerDown = (e) => {
    showControls();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setInitialPosX(bgPosX);
    setDragDirection("none");
  };

  const handlePointerMove = (e) => {
    showControls();
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Hover-based panning if not dragging
    if (!isDragging) {
      const ratio = e.clientX / containerWidth;
      let newPosX = ratio * 100;
      newPosX = Math.max(0, Math.min(100, newPosX));
      setBgPosX(newPosX);
      return;
    }

    // Drag direction lock
    if (dragDirection === "none") {
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD
      ) {
        setDragDirection("horizontal");
      } else if (
        Math.abs(deltaY) > Math.abs(deltaX) &&
        Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD
      ) {
        setDragDirection("vertical");
      }
    }

    if (dragDirection === "horizontal") {
      const deltaPercent = (deltaX / containerWidth) * 100;
      let newPosX = initialPosX + deltaPercent;
      newPosX = Math.max(0, Math.min(100, newPosX));
      setBgPosX(newPosX);
    }
  };

  const handlePointerUpOrLeave = (e) => {
    showControls();
    if (!isDragging) return;
    setIsDragging(false);

    if (dragDirection === "vertical") {
      const deltaY = e.clientY - startY;
      if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
        if (deltaY < 0) {
          // Swiped up => prev image
          prevImage();
        } else {
          // Swiped down => next image
          nextImage();
        }
      }
    }
    setDragDirection("none");
  };

  // ---------------------------------
  // Wheel (Inverted Scroll)
  // ---------------------------------
  const handleWheel = (e) => {
    showControls();
    if (e.deltaY > 0) {
      // Scrolling down => prev
      prevImage();
    } else {
      // Scrolling up => next
      nextImage();
    }
  };

  // ---------------------------------
  // Next/Prev with Wraparound
  // ---------------------------------
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setBgPosX(50);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setBgPosX(50);
  };

  return (
    <div
      className="landing-container"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      onWheel={handleWheel}
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundPosition: `${bgPosX}% center`
      }}
    >
      {/* Hamburger menu */}
      <button
        className="hamburger-menu"
        aria-label="Open Menu"
        onClick={handleHamburgerClick}       // For mobile & also desktop closing
        onMouseEnter={handleHamburgerMouseEnter} // For desktop hover
      >
        &#9776;
      </button>

      {/* Fullscreen Menu Overlay (stacks color blocks) */}
      <div className={`menu-overlay ${isMenuOpen ? 'show' : ''}`}>
        {navItems.map((item) => (
          <div
            key={item.label}
            className="menu-item"
            style={{ backgroundColor: item.color }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Scroll Controls (left-middle) */}
      <div
  className="scroll-controls"
  style={{ opacity: isMenuOpen ? 0 : (controlsVisible ? 1 : 0) }}
>
        <span className="arrow up">↑</span>
        <span className="label scroll-label">Scroll</span>
        <span className="arrow down">↓</span>
      </div>

      {/* Pan Controls (bottom-center) */}
      <div
  className="pan-controls"
  style={{ opacity: isMenuOpen ? 0 : (controlsVisible ? 1 : 0) }}
>
        <div className="pan-row">
          <span className="arrow left">←</span>
          <span className="label pan-label">Pan</span>
          <span className="arrow right">→</span>
        </div>
      </div>
    </div>
  );
}

export default App;
