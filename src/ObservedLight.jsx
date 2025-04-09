import React, { useState, useEffect, useRef } from 'react';
import './ObservedLight.css';
import Header from './Header';

const TOTAL_PAGES = 42;

export default function ObservedLight() {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  // Scroll-based animation logic
  const exhibitingRef = useRef(null);
  const printRef = useRef(null);
  const [animateExhibiting, setAnimateExhibiting] = useState(false);
  const [animatePrint, setAnimatePrint] = useState(false);

  useEffect(() => {

    window.scrollTo(0, 0);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
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
      <main className="route-container observed-container">
        <h1 className="observed-header">Observed Light</h1>
        <p className="observed-description">
          A visual study of perception, presence, and the curious behavior of light when it knows it's being watched.
          <br /><br />
          An exhibit by Bob Baker <small><a href="#exhibiting" className="more-link">(more below)</a></small>
        </p>

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
            <p><strong>Images Art Gallery</strong><br />
              April 16 through May 10</p>
            <p><strong>Opening Reception:</strong><br /> Friday, April 18, 5–8 p.m.<br />
              Historic Downtown Overland Park, Kansas</p>
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
              a book by Bob Baker<br />
              11&quot; x 8.5&quot;, 40 pages, full color
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
    </>
  );
}
