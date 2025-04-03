import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

console.log("✅ Landing component is rendering");

const images = [
  'text-block',
  '/images/20250304_303_OWL4767.jpg',
  '/images/20250120_303_OWL4061.jpg',
  '/images/20250304_303_OWL4775.jpg',
];

const Landing = ({ isMenuOpen }) => {
  console.log('✅ Landing is rendering');

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

  const handleWheel = (e) => {
    showControls();
    const now = Date.now();
    if (now - lastWheelTimeRef.current < SCROLL_COOLDOWN) return;
    lastWheelTimeRef.current = now;
    triggerFade(() =>
      setCurrentIndex((prev) =>
        e.deltaY > 0 ? (prev + 1) % images.length : (prev - 1 + images.length) % images.length
      )
    );
  };

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

    if (isDragging) {
      if (dragDirection === 'none') {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD) {
          setDragDirection('horizontal');
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD) {
          setDragDirection('vertical');
        }
      }

      if (dragDirection === 'horizontal') {
        const newPosX = initialPosX + (deltaX / containerWidth) * 100;
        setBgPosX(Math.max(0, Math.min(100, newPosX)));
      }
    } else {
      const ratio = e.clientX / containerWidth;
      setBgPosX(Math.max(0, Math.min(100, ratio * 100)));
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
      className={`landing-container ${fadeClass} ${currentIndex === 0 ? 'first-block' : ''}`}
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      style={{
        backgroundImage:
          images[currentIndex] === 'text-block'
            ? 'url(/images/20240907_303_OWL0880.jpg)'
            : `url(${images[currentIndex]})`,
        backgroundPosition: `${bgPosX}% center`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
      }}
    >
      <img
        src="/images/SignatureLogo.png"
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
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
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
                Featured Opening<br /> Apr 18 5p—8p<br />OP/KS
              </div>
            </a>
          )}
          {currentIndex === 3 && (
            <Link
              to="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e"
              className="text-slide link-slide"
            >
              <div>ORDER</div>
              <div>PRINTS</div>
              <div>ONLINE</div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Landing;
