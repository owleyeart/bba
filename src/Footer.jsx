// src/Footer.jsx

import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a href='https://www.bobbaker.art'>www.BobBaker.art</a>
        <p>&copy; {new Date().getFullYear()} · Bob Baker</p>
      </div>
    </footer>
  );
}