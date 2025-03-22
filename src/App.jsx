// src/App.jsx

import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Projects from './Projects.jsx';                
import FallingAway from './Projects/Falling-Away.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import './App.css';

// Example images
const images = [
  '/images/20240907_303_OWL0880.jpg',
  '/images/20241013_303_OWL1733.jpg',
  '/images/20250304_303_OWL4767.jpg',
  '/images/20230222_303_OWL6609.jpg',
  '/images/20250304_303_OWL4775.jpg',
  '/images/20240907_303_OWL0886.jpg',
  '/images/20230814_303_OWL4849.jpg',
  '/images/20240701_303_OWL8456.jpg',
  '/images/20160220_303_NOV3228.jpg',
  '/images/20250303_303_OWL4733.jpg',
  '/images/20240619_303_OWL8024.jpg',
];

// Semi-transparent nav items (no Gallery/Purchase)
const navItems = [
  { label: 'Home',     color: 'rgba(0, 0, 0, 0.63)' },
  { label: 'Projects', color: 'rgba(72, 27, 72, 0.81)' },
  { label: 'About',    color: 'rgba(178, 11, 105, 0.72)' },
  { label: 'Contact',  color: 'rgba(212, 69, 94, 0.81)' },
  { label: '',         color: 'rgba(59, 11, 51, 0.27)' }, // extra block if desired
];

/* 
  LANDING COMPONENT
  - pointer logic & controlsVisible for Scroll/Pan
  - background images with scroll cooldown
  - LOGO: hide if isMenuOpen === true
*/
function Landing({ isMenuOpen }) {
  const containerRef = useRef(null);

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

  // Fade-in logic for Scroll & Pan controls
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef(null);

  function showControls() {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 900);
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // SCROLL WHEEL COOLDOWN
  const lastWheelTimeRef = useRef(0);
  const SCROLL_COOLDOWN = 500;

  function handleWheel(e) {
    showControls();
    const now = Date.now();
    if (now - lastWheelTimeRef.current < SCROLL_COOLDOWN) return;
    lastWheelTimeRef.current = now;

    if (e.deltaY > 0) {
      // next
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else {
      // prev
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }

  // Pointer events to show controls & handle drag/pan
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

    // If not dragging, do a hover-based horizontal pan
    if (!isDragging) {
      const ratio = e.clientX / containerWidth;
      let newPosX = ratio * 100;
      newPosX = Math.max(0, Math.min(100, newPosX));
      setBgPosX(newPosX);
      return;
    }

    // If dragging, lock direction
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

    // If vertical drag, decide if we switch images
    if (dragDirection === "vertical") {
      const deltaY = e.clientY - startY;
      if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
        if (deltaY < 0) {
          // swiped up => prev
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        } else {
          // swiped down => next
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }
      }
    }
    setDragDirection("none");
  };

  return (
    <div
      className="landing-container"
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundPosition: `${bgPosX}% center`,
      }}
    >
      {/* Centered Logo at top; hide if menu is open */}
      <img
        src="/images/Signature%20Logo.svg"
        alt="Signature Logo"
        className="landing-logo"
        style={{
          display: isMenuOpen ? 'none' : 'block'
        }}
      />

      {/* Scroll Controls (right-middle) */}
      <div
        className="scroll-controls"
        style={{ opacity: controlsVisible ? 1 : 0 }}
      >
        <span className="arrow up">↑</span>
        <span className="label scroll-label">Scroll</span>
        <span className="arrow down">↓</span>
      </div>

      {/* Pan Controls (bottom-center) */}
      <div
        className="pan-controls"
        style={{ opacity: controlsVisible ? 1 : 0 }}
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
  - We define global menu logic, routes, etc.
*/
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNavItemClick(item) {
    if (item.label === 'Home') {
      window.location.href = '/';
    } else if (item.label === 'Projects') {
      window.location.href = '/Projects';
    } else if (item.label === 'About') {
      window.location.href = '/About';
    } else if (item.label === 'Contact') {
      window.location.href = '/Contact';
    } else {
      setIsMenuOpen(false);
    }
  }

  const handleHamburgerClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleHamburgerMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsMenuOpen(true);
    }
  };

  return (
    <Router>
      {/* GLOBAL MENU: always on top */}
      <button
  className="hamburger-menu"
  aria-label="Toggle Menu"
  onClick={handleHamburgerClick}
  onMouseEnter={handleHamburgerMouseEnter}
>
  {isMenuOpen ? '✕' : '\u2630'}
</button>

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

      <Routes>
        {/* Pass isMenuOpen to Landing so it can hide the logo if true */}
        <Route path="/" element={<Landing isMenuOpen={isMenuOpen} />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Projects/falling-away" element={<FallingAway />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
