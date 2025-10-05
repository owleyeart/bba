// ///////////////////////////////////////////////////////
// Bob Baker - Bob Baker Art, September 28, 2025       //
// Gallery integration with SharePoint API             //
// ///////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Landing from './Landing';
import Projects from './Projects.jsx';
import About from './About.jsx';
import Observed from './Observed';
import Newsletter from './Newsletter.jsx';
import News from './News.jsx';
import Footer from './Footer';
import Gallery from './Gallery.jsx'; // Import the new Gallery component
import Transfix from './Projects/Transfix';

import './PageBackgrounds.css';
import './styles/App.css';
import './styles/Landing.css';
import './styles/Menu.css';

const navItems = [
  { label: 'Home', color: 'rgba(59, 11, 51, 0.72 )' },
  {
    label: 'Projects',
    color: 'rgba(72, 27, 72, 0.72)',
    submenu: [
      { label: 'Observed Light', link: '/Observed' },
      { label: 't_r_a_n_s_f_i_x', link: '/Transfix' },
    ],
  },
  {
    label: 'Gallery',
    color: 'rgba(124, 19, 89, 0.63)',
    link: '/gallery',
  },
  {
    label: 'News',
    color: 'rgba(148, 15, 99, 0.63)',
    link: '/news',
  },
  //{ label: 'Contact', link: 'https://www.instagram.com/owleyeart', color: 'rgba(178, 11, 105, 0.63)' },
];

function AppWrapper() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [isMenuExiting, setIsMenuExiting] = useState(false);
  const [isMenuReady, setIsMenuReady] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target)) {
        // Close the menu
        setIsMenuExiting(true);
        setTimeout(() => {
          setIsMenuOpen(false);
          setIsMenuReady(false);
          setIsMenuExiting(false);
          setExpandedItem(null);
        }, 500);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleNavItemClick = (item) => {
    if (item.submenu) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
    } else if (item.link?.startsWith('http')) {
      window.open(item.link, '_blank', 'noreferrer');
      setIsMenuOpen(false);
      setExpandedItem(null);
    } else {
      // Handle internal navigation including gallery
      const targetPath = item.link || (item.label === 'Home' ? '/' : `/${item.label}`);
      window.location.href = targetPath;
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
    if (isMenuOpen) {
      setIsMenuExiting(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMenuReady(false);
        setIsMenuExiting(false);
        setExpandedItem(null);
      }, 500);
    } else {
      setIsMenuOpen(true);
      setTimeout(() => setIsMenuReady(true), 100);
    }
  };

  return (
    <>
      <button ref={hamburgerRef} className="hamburger-menu" onClick={handleHamburgerClick}>
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <div ref={menuRef} className={`menu-overlay 
        ${isMenuOpen ? 'show' : ''} 
        ${isMenuReady && !isMenuExiting ? 'menu-ready' : ''} 
        ${isMenuExiting ? 'menu-exiting' : ''}`}>

        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <div
              className="menu-item"
              style={{ backgroundColor: item.color }}
              onClick={() => handleNavItemClick(item)}
              tabIndex={0}
              role="button"
              aria-haspopup={!!item.submenu}
              aria-expanded={expandedItem === item.label}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavItemClick(item);
                }
              }}
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

        <div className={`menu-social-icons ${(isMenuReady || isMenuExiting) ? 'show-icons' : ''}`}>
          <a href="https://www.threads.net/@owleyeart" target="_blank" rel="noopener noreferrer">
            <img src="/images/threads-icon.png" alt="Threads" />
          </a>
          <a href="https://www.linkedin.com/in/bob-baker-owleye/" target="_blank" rel="noopener noreferrer">
            <img src="/images/linkedin-icon.png" alt="LinkedIn" />
          </a>
          <a href="https://www.instagram.com/owleyeart" target="_blank" rel="noopener noreferrer">
            <img src="/images/instagram-icon.png" alt="Instagram" />
          </a>
          <a href="mailto:bob@bobbaker.art">
            <img src="/images/email-icon.png" alt="Email" />
          </a>
        </div>
      </div>

      <Routes location={location}>
        <Route path="/" element={<Landing isMenuOpen={isMenuOpen} />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/About" element={<About />} />
        <Route path="/Observed" element={<Observed />} />
        <Route path="/Newsletter" element={<Newsletter />} />
        <Route path="/News" element={<News />} />
        <Route path="/Transfix" element={<Transfix />} />
        
        {/* Gallery Routes */}
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:galleryId" element={<Gallery />} />
        <Route path="/gallery/search" element={<Gallery />} />
      </Routes>

      {location.pathname !== '/' && <Footer />}
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