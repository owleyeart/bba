// ///////////////////////////////////////////////////////
// Bob Baker - Bob Baker Art, April 2025
// Observed Light - Title and Description
// ///////////////////////////////////////////////////////

import React, { useState } from 'react';
import './Observed.css';
import Header from './Header';

const TOTAL_PAGES = 42;

export default function Observed() {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  return (
    <>
    <Header />
    <div className="observed-wrapper">
    <div className="glass-panel">
        <div className="carousel">
          <button className="arrow left" onClick={handlePrev} aria-label="Previous">&#10094;</button>
          <img
            src={`/images/observed-light/${String(currentPage + 1).padStart(2, '0')}.jpg`}
            alt={`Page ${currentPage + 1}`}
            className="carousel-image"
          />
          <button className="arrow right" onClick={handleNext} aria-label="Next">&#10095;</button>
        </div>

        <div className="page-counter">
          Page {currentPage + 1} of {TOTAL_PAGES}
        </div>

        <a href="#description" className="scroll-cta">
            <span className="scroll-text">Scroll Down</span>
            <span className="scroll-arrow">↓</span>
        </a>

        <h1 className="observed-title">Observed Light</h1>
        <p id="description" className="observed-description">
            A visual study of perception, presence, and the curious behavior of light when it knows it's being watched.
            <br />
            <span className="byline">—An exhibit by Bob Baker</span>
        </p>

        <div className="button-group">
            <a
                href="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e"
                target="_blank"
                rel="noopener noreferrer"
                className="action-button book-button"
            >
                Order Book Online
            </a>

{/*             <section className="info-section">
                <h1 className="section-header">Exhibiting</h1>
                <h2 className="info-subheader">Images Art Gallery</h2>
                <p className="info-text">April 16 through May 10</p>

                <h2 className="info-subheader">Opening Reception:</h2>
                <p className="info-text">
                    Friday, April 18, 5–8 p.m.<br />
                    Historic Downtown Overland Park, Kansas
                </p>
            </section> */}

            <section className="info-section">
                <h1 className="section-header">In Print Now</h1>
                <h2 className="info-subheader">"Observed Light"</h2>
                <p className="info-text">
                    a book by Bob Baker<br />
                    11" x 8.5", 40 pages, full color<br />
                    Find the NEW book at Images Art Gallery or Online:
                </p>
            </section>
            <a
                href="https://www.imagesgallery.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="action-button book-button"
            >
                Pick Up in Person
            </a>

        </div>

            <br>
            </br>
            <br>
            </br>
            <br>
            </br>
            <br>
            </br>
            <br>
            </br>

      </div>
      </div>
    </>
  );
}
