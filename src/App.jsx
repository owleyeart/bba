/////////////////////////////////////////////////////// 
// Bob Baker - Owl Eye Art Institute, April 2025     //
///////////////////////////////////////////////////////

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Landing from './Landing';
import Projects from './Projects.jsx';
import FallingAway from './Projects/Falling-Away.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import ObservedLight from './ObservedLight';
import Footer from './Footer';

import './App.css';

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
      { label: 'All Galleries', link: 'https://bobphotography9.zenfoliosite.com' },
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
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Projects/falling-away" element={<FallingAway />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/observed-light" element={<ObservedLight />} />
      </Routes>

      {/* ✅ Conditionally render footer */}
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
