// src/App.jsx

import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Projects from './Projects.jsx';                // The main Projects page
import FallingAway from './Projects/Falling-Away.jsx'; // Sub-page under /Projects/falling-away

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

// Semi-transparent nav items
const navItems = [
  { label: 'Home',     color: 'rgba(0, 0, 0, 0.63)' },
  { label: 'Gallery',  color: 'rgba(59, 11, 51, 0.81)' },
  { label: 'Projects', color: 'rgba(72, 27, 72, 0.81)' },
  { label: 'About',    color: '#b00b69' },
  { label: 'Contact',  color: 'rgba(212, 69, 94, 0.81)' },
  { label: 'Purchase', color: 'rgba(255, 173, 118, 0.72)' },
];

/* 
  LANDING COMPONENT
  - All your existing logic for images, drag, hover menu, etc.
  - This will serve as the "/" (home) route.
*/
function Landing() {
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

  // Hamburger Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNavItemClick(item) {
    if (item.label === 'Home') {
      // Navigate to root
      window.location.href = '/';
    } else if (item.label === 'Projects') {
      // Navigate to /Projects
      window.location.href = '/Projects';
    } else {
      // For other items, just close the menu (or handle differently)
      setIsMenuOpen(false);
    }
  }
  

  // For mobile & also desktop close
  const handleHamburgerClick = () => {
    showControls(); 
    setIsMenuOpen((prev) => !prev);
  };

  // For desktop hover-capable devices
  const handleHamburgerMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      showControls();
      setIsMenuOpen(true);
    }
  };

  // Keyboard Arrows (Inverted Scroll)
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

  // Pointer Events
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

  // Wheel (Inverted Scroll)
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

  // Next/Prev with Wraparound
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
        onClick={handleHamburgerClick}       
        onMouseEnter={handleHamburgerMouseEnter}
      >
        &#9776;
      </button>

      {/* Fullscreen Menu Overlay */}
      <div className={`menu-overlay ${isMenuOpen ? 'show' : ''}`}>
        {navItems.map((item) => (
          <div
            key={item.label}
            className="menu-item"
            style={{ backgroundColor: item.color }}
            onClick={() => handleNavItemClick(item)}
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

/* 
  APP COMPONENT WITH ROUTES
  - We wrap everything in a Router and define:
    - "/" => Landing (home page)
    - "/Projects" => Projects.jsx
    - "/Projects/falling-away" => Falling-Away.jsx
*/
function App() {
  return (
    <Router>
      <Routes>
        {/* Root: your "landing" logic */}
        <Route path="/" element={<Landing />} />

        {/* Projects page */}
        <Route path="/Projects" element={<Projects />} />

        {/* Falling Away sub-page */}
        <Route path="/Projects/Falling-Away" element={<FallingAway />} />
      </Routes>
    </Router>
  );
}

export default App;
