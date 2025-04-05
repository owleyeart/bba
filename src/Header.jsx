// src/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="global-header">
    <Link to="/">
      <img
        src="/images/SignatureLogo.png"
        alt="Bob Baker Logo"
        className="header-logo"
      />
    </Link>
  </header>
);

export default Header;
