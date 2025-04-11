// ///////////////////////////////////////////////////////
// Bob Baker - Owl Eye Art Institute, April 2025
// Observed Light - Parallax Background Scroll Fix
// ///////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from 'react';
import './Observed';
import Header from './Header';

const TOTAL_PAGES = 42;

export default function ObservedLight() {
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  const exhibitingRef = useRef(null);
  const printRef = useRef(null);
  const [animateExhibiting, setAnimateExhibiting] = useState(false);
  const [animatePrint, setAnimatePrint] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === exhibitingRef.current) setAnimateExhibiting(true);
            if (entry.target === printRef.current) setAnimatePrint(true);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (exhibitingRef.current) observer.observe(exhibitingRef.current);
    if (printRef.current) observer.observe(printRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      {/* The inline style now only updates the dynamic transform */}
      <div
        className="observed-background-image"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        aria-hidden="true"
      ></div>

      <div className="observed-background-wrapper">
        <main className="route-container observed-container">
          <div className="slider">
            <div className="slider-inner">
              <button className="arrow left" onClick={handlePrev} aria-label="Previous page">
                &#10094;
              </button>
              <img
                src={`/images/observed-light/${String(currentPage + 1).padStart(2, '0')}.jpg`}
                alt={`Observed Light page ${currentPage + 1}`}
                className="slider-image"
              />
              <button className="arrow right" onClick={handleNext} aria-label="Next page">
                &#10095;
              </button>
            </div>
          </div>

          <div className="page-number">
            Page {currentPage + 1} of {TOTAL_PAGES}
          </div>

          <a href="#exhibiting" className="scroll-down-cta">
            <span className="scroll-text">Scroll Down</span>
            <span className="scroll-arrow">↓</span>
          </a>

          <h1 className="observed-header">Observed Light</h1>
          <p className="observed-description">
            A visual study of perception, presence, and the curious behavior of light when it knows it's being watched.
            <br /><br />
            An exhibit by Bob Baker <small><a href="#exhibiting" className="more-link">(more below)</a></small>
          </p>

          <br /><br />
          <a
            href="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e"
            target="_blank"
            id="exhibiting"
            rel="noopener noreferrer"
            className="buy-button"
          >
            Buy Book Online
          </a>

          <section
            className={`book-section exhibiting-section ${animateExhibiting ? 'animate' : ''}`}
            ref={exhibitingRef}
          >
            <div className="book-info">
              <h2>Exhibiting</h2>
              <p>
                <strong>Images Art Gallery</strong>
                <br />
                April 16 through May 10
              </p>
              <p>
                <strong>Opening Reception:</strong>
                <br />
                Friday, April 18, 5–8 p.m.
                <br />
                Historic Downtown Overland Park, Kansas
              </p>
            </div>
          </section>

          <section
            className={`book-section print-section ${animatePrint ? 'animate' : ''}`}
            ref={printRef}
          >
            <div className="book-info">
              <h2>In Print Now</h2>
              <h3>"Observed Light"</h3>
              <div className="book-author">
                a book by Bob Baker
                <br />
                11" x 8.5", 40 pages, full color
              </div>
              <p>Find the NEW book at Images Art Gallery or Online:</p>
              <a
                href="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e"
                target="_blank"
                rel="noopener noreferrer"
                className="buy-button"
              >
                Buy Book Online
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
