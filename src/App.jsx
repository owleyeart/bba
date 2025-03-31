// src/App.jsx

import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Projects from './Projects.jsx';
import FallingAway from './Projects/Falling-Away.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import './App.css';

// Example images (updated to three images)
const images = [
  '/images/20250304_303_OWL4767.jpg',
  '/images/20240619_303_OWL8024.jpg',
  '/images/20250304_303_OWL4775.jpg',
];

// Define the global navigation items.
// The "Projects" item now has a submenu.
const navItems = [
  { label: 'Home', color: 'rgba(0, 0, 0, 0.63)' },
  { 
    label: 'Projects', 
    color: 'rgba(72, 27, 72, 0.81)',
    submenu: [
      { label: 'Observed Light', link: 'https://www.bobbaker.art/observed-light', icon: '🌌' },
      { label: 'Portfolio', link: 'https://www.owleyeart.com/artists/bob-baker', icon: '🖼️' },
      { label: 'Falling Away', link: '/Projects/falling-away', icon: '🌀' },
      { label: 'All Projects', link: '/Projects', icon: '📂' }
    ]
  },
  { label: 'About', color: 'rgba(178, 11, 105, 0.72)' },
  { label: 'Contact', color: 'rgba(212, 69, 94, 0.81)' },
];


/* 
  LANDING COMPONENT
  - Contains background image logic, pointer & wheel events,
  - Renders the centered logo (which hides when the global menu is open).
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
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 900);
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
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
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }

  // Pointer events
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
    if (!isDragging) {
      const ratio = e.clientX / containerWidth;
      let newPosX = ratio * 100;
      newPosX = Math.max(0, Math.min(100, newPosX));
      setBgPosX(newPosX);
      return;
    }
    if (dragDirection === "none") {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD) {
        setDragDirection("horizontal");
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD) {
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
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        } else {
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
        style={{ display: isMenuOpen ? 'none' : 'block' }}
      />

      {/* Scroll Controls (right-middle) */}
      <div className="scroll-controls" style={{ opacity: controlsVisible ? 1 : 0 }}>
        <span className="arrow up">↑</span>
        <span className="label scroll-label">Scroll</span>
        <span className="arrow down">↓</span>
      </div>

      {/* Pan Controls (bottom-center) */}
      <div className="pan-controls" style={{ opacity: controlsVisible ? 1 : 0 }}>
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
  APP COMPONENT WITH ROUTES & GLOBAL MENU (with submenu support)
*/
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);



  function handleNavItemClick(item) {
    if (item.submenu) {
      // Toggle submenu expansion for items with submenu
      setExpandedItem(expandedItem === item.label ? null : item.label);
    } else {
      // Navigate for items without submenu
      if (item.label === 'Home') {
        window.location.href = '/';
      } else if (item.label === 'About') {
        window.location.href = '/About';
      } else if (item.label === 'Contact') {
        window.location.href = '/Contact';
      } else {
        window.location.href = `/${item.label}`;
      }
      setIsMenuOpen(false);
      setExpandedItem(null);
    }
  }

  function handleSubmenuClick(subitem) {
    if (subitem.link.startsWith('http')) {
      window.open(subitem.link, '_blank', 'noreferrer');
    } else {
      window.location.href = subitem.link;
    }
    setIsMenuOpen(false);
    setExpandedItem(null);
  }

  const handleHamburgerClick = () => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) setExpandedItem(null);
  };



  return (
    <Router>
      {/* GLOBAL MENU */}
      <button
        className="hamburger-menu"
        aria-label="Toggle Menu"
        onClick={handleHamburgerClick}
      >
        {isMenuOpen ? '✕' : '\u2630'}
      </button>

      <div className={`menu-overlay ${isMenuOpen ? 'show' : ''}`}>
      {navItems.map((item) => (
  <React.Fragment key={item.label}>
    <div
      className="menu-item"
      style={{ backgroundColor: item.color }}
      onClick={() => handleNavItemClick(item)}
    >
      {item.label}
    </div>
    {item.submenu && expandedItem === item.label && (



  <div className="submenu">
    {item.submenu.map((subitem, index) => {
      // Lighter purples as a palette
      const shades = [
        'rgba(168, 109, 168, 0.4)', // soft lavender
        'rgba(168, 109, 168, 0.6)',
        'rgba(168, 109, 168, 0.8)'
      ];
      const backgroundColor = shades[index % shades.length];

      return (
        <div
  key={subitem.label}
  className="submenu-item"
  style={{ backgroundColor }}
  onClick={() => handleSubmenuClick(subitem)}
  tabIndex={0} // ✅ Allows focus with keyboard
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleSubmenuClick(subitem); // ✅ Allows Enter/Space to activate
    }
  }}
>
  <span className="submenu-icon" style={{ marginRight: '0.75rem' }}>
    {subitem.icon}
  </span>
  {subitem.label}
</div>

      );
    })}
  </div>
)}


  </React.Fragment>
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
