// src/Footer.jsx

import React from 'react';
import './Footer.css'; // optional CSS

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Bob Baker · Owl Eye Art Institute</p>
    </footer>
  );
}
