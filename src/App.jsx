// src/App.jsx

import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Portraits from './Portraits';
import Projects from './Projects.jsx';
import FallingAway from './Projects/Falling-Away.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import ObservedLight from './ObservedLight'; // adjust path if it's in a folder

import './App.css';

const images = [
  '/images/20250304_303_OWL4767.jpg',
  '/images/20250120_303_OWL4061.jpg',
  '/images/20250304_303_OWL4775.jpg',
];

const navItems = [
  { label: 'Home', color: 'rgba(59, 11, 51, 0.72 )' },
  {
    label: 'Projects',
    color: 'rgba(72, 27, 72, 0.72)',
    submenu: [
      { label: 'Observed Light', link: '/observed-light' },
      { label: 'Falling Away', link: '/Projects/falling-away' },
      { label: 'All Projects', link: '/Projects' },
    ],
  },
  {
    label: 'About',
    color: 'rgba(178, 11, 105, 0.63)',
    submenu: [
      { label: 'About Bob Baker', link: '/About' },
      { label: 'Portfolio', link: 'https://www.owleyeart.com/artists/bob-baker' },
    ],
  },
  { label: 'Contact', color: 'rgba(212, 69, 94, 0.72)' },
];

/* LANDING COMPONENT */
function Landing({ isMenuOpen }) {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPosX, setBgPosX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [initialPosX, setInitialPosX] = useState(50);
  const [dragDirection, setDragDirection] = useState('none');
  const DRAG_DIRECTION_THRESHOLD = 20;
  const VERTICAL_SWIPE_THRESHOLD = 50;
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef(null);
  const lastWheelTimeRef = useRef(0);
  const SCROLL_COOLDOWN = 500;

  function showControls() {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 900);
  }

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

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
    if (!isDragging) {
      const ratio = e.clientX / containerWidth;
      let newPosX = Math.max(0, Math.min(100, ratio * 100));
      setBgPosX(newPosX);
      return;
    }
    if (dragDirection === 'none') {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD) {
        setDragDirection('horizontal');
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD) {
        setDragDirection('vertical');
      }
    }
    if (dragDirection === 'horizontal') {
      let newPosX = initialPosX + (deltaX / containerWidth) * 100;
      setBgPosX(Math.max(0, Math.min(100, newPosX)));
    }
  };

  const handlePointerUpOrLeave = (e) => {
    showControls();
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDirection === 'vertical') {
      const deltaY = e.clientY - startY;
      if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
        setCurrentIndex((prev) =>
          deltaY < 0 ? (prev - 1 + images.length) % images.length : (prev + 1) % images.length
        );
      }
    }
    setDragDirection('none');
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
      <img
        src="/images/Signature%20Logo.svg"
        alt="Signature Logo"
        className="landing-logo"
        style={{ display: isMenuOpen ? 'none' : 'block' }}
      />

<div className="scroll-controls" style={{ opacity: controlsVisible ? 1 : 0 }}>
  <span className="label scroll-label">Scroll</span>
  <div className="arrow-group vertical">
    <span className="arrow up">&#8593;</span>
    <span className="arrow down">&#8595;</span>
  </div>
</div>

<div className="pan-controls" style={{ opacity: controlsVisible ? 1 : 0 }}>
  <span className="label pan-label">Pan</span>
  <div className="arrow-group horizontal">
    <span className="arrow left">&#8594;</span>
    <span className="arrow right">&#8592;</span>
  </div>
</div>





      {/* Centered Text Overlay with Scroll-Synced Transitions */}
      <div className="landing-text-block">
        {currentIndex === 0 && (
          <Link to="/observed-light" className="text-slide link-slide">
            Enter Exhibit →
          </Link>
        )}
        {currentIndex === 1 && (
          <a
          href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=c3IyaG1rOXZ2NHBzMTFpdXM4ajVkNXFhOXNfMjAyNTA0MThUMjIwMDAwWiAwZjRkNDIyYzEzZTFmN2VhMjZiOGRiMDdmNDJlNWNmZmNlZmEzZmExZDBjZDM1MjNlMmUyMDNiMzU1NTgzYTlmQGc&tmsrc=0f4d422c13e1f7ea26b8db07f42e5cffcefa3fa1d0cd3523e2e203b355583a9f%40group.calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slide link-slide"
        >
          Add to Google Calendar
            <div>Images</div>
            <div>Art</div>
            <div>Gallery</div>
            <br />
            <div>Apr 16—May 10</div>
            <div style={{ fontSize: '1rem', marginTop: '0.25rem' }}>
              Featured Opening Apr 18 5p—8p<br />OP/KS
            </div>
          </a>
        )}
        {currentIndex === 2 && (
          <Link to="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e" className="text-slide link-slide">
            <div>ORDER</div>
            <div>PRINTS</div>
            <div>ONLINE</div>
          </Link>
        )}
      </div>
    </div>
  );
}

/* APP WRAPPER WITH ROUTES */
function AppWrapper() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const handleNavItemClick = (item) => {
    if (item.submenu) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
    } else {
      window.location.href = item.label === 'Home' ? '/' : `/${item.label}`;
      setIsMenuOpen(false);
      setExpandedItem(null);
    }
  };

  const handleSubmenuClick = (subitem) => {
    if (subitem.link.startsWith('http')) {
      window.open(subitem.link, '_blank', 'noreferrer');
    } else {
      window.location.href = subitem.link;
    }
    setIsMenuOpen(false);
    setExpandedItem(null);
  };

  const handleHamburgerClick = () => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) setExpandedItem(null);
  };

  return (
    <>
      <button className="hamburger-menu" onClick={handleHamburgerClick}>
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
                {item.submenu.map((subitem, i) => (
                  <div
                    key={subitem.label}
                    className="submenu-item"
                    style={{
                      backgroundColor: `rgba(168, 109, 168, ${0.4 + i * 0.2})`,
                    }}
                    onClick={() => handleSubmenuClick(subitem)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSubmenuClick(subitem);
                      }
                    }}
                  >
                    <span className="submenu-icon" style={{ marginRight: '0.75rem' }}>
                      {subitem.icon}
                    </span>
                    {subitem.label}
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Animated Page Transitions */}
      <TransitionGroup component={null}>
        <CSSTransition key={location.pathname} timeout={500} classNames="page">
          <Routes location={location}>
            <Route path="/" element={<Landing isMenuOpen={isMenuOpen} />} />
            <Route path="/portraits" element={<Portraits />} />
            <Route path="/Projects" element={<Projects />} />
            <Route path="/Projects/falling-away" element={<FallingAway />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/observed-light" element={<ObservedLight />} />

          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
