// src/App.jsx

/////////////////////////////////////////////////////// 
// Bob Baker - Owl Eye Art Institute, April 2025     //
///////////////////////////////////////////////////////

import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Portraits from './Portraits';
import Projects from './Projects.jsx';
import FallingAway from './Projects/Falling-Away.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import ObservedLight from './ObservedLight';


import './App.css';

const images = [
  'text-block',
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
    label: 'Gallery',
    color: 'rgba(124, 19, 89, 0.63)',
    submenu: [
      { label: 'Portraits', link: '/Portraits' },
      { label: 'All Galleries', link: '/Galleries' },
    ],
  },
  {
    label: 'About',
    color: 'rgba(178, 11, 105, 0.63)',
    submenu: [
      { label: 'About Bob Baker', link: '/About' },
      { label: 'Newsletter', link: '/Newsletter' },
      { label: 'Portfolio', link: 'https://www.owleyeart.com/artists/bob-baker' },
    ],
  },
  { label: 'Contact', color: 'rgba(212, 69, 94, 0.72)' },
];

function Landing({ isMenuOpen }) {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPosX, setBgPosX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [initialPosX, setInitialPosX] = useState(50);
  const [dragDirection, setDragDirection] = useState('none');
  const [fadeClass, setFadeClass] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 900);
    return () => clearTimeout(hideTimerRef.current);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      let start = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / 9000) * 100, 100);
        setProgress(percent);
        if (percent === 100) {
          triggerFade(() => setCurrentIndex((prev) => (prev + 1) % images.length));
          start = Date.now();
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerFade = (updateFn) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      updateFn();
      setFadeClass('fade-in');
      setTimeout(() => setFadeClass(''), 1000);
    }, 300);
  };

  function handleWheel(e) {
    showControls();
    const now = Date.now();
    if (now - lastWheelTimeRef.current < SCROLL_COOLDOWN) return;
    lastWheelTimeRef.current = now;
    triggerFade(() =>
      setCurrentIndex((prev) => (e.deltaY > 0 ? (prev + 1) % images.length : (prev - 1 + images.length) % images.length))
    );
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
      setBgPosX(Math.max(0, Math.min(100, ratio * 100)));
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
      className={`landing-container ${fadeClass}`}
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      style={
        images[currentIndex] === 'text-block'
          ? {
              backgroundColor: '#222',
              backgroundImage: 'none',
              color: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }
          : {
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundPosition: `${bgPosX}% center`,
            }
      }
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
          <span className="arrow up">↑</span>
          <span className="arrow down">↓</span>
        </div>
      </div>

      <div className="pan-controls" style={{ opacity: controlsVisible ? 1 : 0 }}>
        <span className="label pan-label">Pan</span>
        <div className="arrow-group horizontal">
          <span className="arrow left">→</span>
          <span className="arrow right">←</span>
        </div>
      </div>

      <button
        className="play-pause-toggle"
        onClick={() => setIsPlaying((prev) => !prev)}
        aria-label="Toggle auto-play"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      <div className="progress-bar-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%`}}></div>
      </div>

      {images[currentIndex] === 'text-block' ? (
        <div className="text-block">
          <h1>Bob Baker</h1>
          <p>Photographer | Visual Artist</p>
        </div>
      ) : (
        <div className="landing-text-block">
          {currentIndex === 1 && (
            <Link to="/observed-light" className="text-slide link-slide">
              Bob Baker <br />
              <small>presents→</small>
              <h2>"Observed Light"</h2>
              <p>an Exhibition</p>
            </Link>
          )}
          {currentIndex === 2 && (
            <a
              href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=c3IyaG..."
              target="_blank"
              rel="noopener noreferrer"
              className="text-slide link-slide"
            >
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
          {currentIndex === 3 && (
            <Link to="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e" className="text-slide link-slide">
              <div>ORDER</div>
              <div>PRINTS</div>
              <div>ONLINE</div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

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
        {isMenuOpen ? '✕' : '☰'}
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
                    style={{ backgroundColor: `rgba(168, 109, 168, ${0.4 + i * 0.2})` }}
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

      <Routes location={location}>
        <Route path="/" element={<Landing isMenuOpen={isMenuOpen} />} />
        <Route path="/portraits" element={<Portraits />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Projects/falling-away" element={<FallingAway />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/observed-light" element={<ObservedLight />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <AppWrapper />
      </div>
    </Router>
  );
}
