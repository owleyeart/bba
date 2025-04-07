import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const images = [
  '/images/20250304_303_OWL4767.jpg',
  '/images/20250120_303_OWL4061.jpg',
  '/images/20250304_303_OWL4775.jpg',
];

const Landing = ({ isMenuOpen }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPosX, setBgPosX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [initialPosX, setInitialPosX] = useState(50);
  const [dragDirection, setDragDirection] = useState('none');
  const [fadeClass, setFadeClass] = useState('');
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
        backgroundImage: `url(${images[currentIndex]})`,
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
      <div className="floating-dots">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="dot" style={{ animationDelay: `${i * 0.5}s` }}></div>
        ))}
      </div>

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

      <div className="landing-text-block">
        {currentIndex === 0 && (
          <Link to="/observed-light" className="text-slide link-slide">
            <div><h3>"Observed Light"</h3></div>
            <div>an Exhibition</div>
          </Link>
        )}

        {currentIndex === 1 && (
          <a
            href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=c3IyaG..."
            target="_blank"
            rel="noopener noreferrer"
            className="text-slide link-slide"
          >
            <h3>Images Art Gallery</h3>
            <p>Apr 16—May 10</p>
            <p style={{ fontSize: '1rem', marginTop: '0.25rem' }}>
              Featured Opening<br /> Apr 18 5p–8p<br />OP/KS
            </p>
          </a>
        )}

        {currentIndex === 2 && (
          <Link
            to="https://mixam.com/print-on-demand/67e8be655221ef3072d7944e"
            className="text-slide link-slide"
          >
            <h3>"Observed Light"</h3>
            <p>—the book—</p>      
            <p>Order your copy online</p>
          </Link>
        )}
      </div>

      <div className="quote-block">
        <p>
          {currentIndex < 2
            ? 'It is said that light behaves differently when it knows it’s being observed...'
            : 'So I set out to discover the answer myself.'}
        </p>
      </div>

      {currentIndex < 2 ? (
        <svg className="sine-wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,50 C240,0 480,100 720,50 C960,0 1200,100 1440,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      ) : (
        <svg className="flat-line" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <line
            x1="0"
            y1="50"
            x2="1440"
            y2="50"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      )}

<div className="floating-dots">
  {Array.from({ length: 18 }).map((_, i) => (
    <div key={i} className={`dot dot-${i + 1}`} />
  ))}
</div>

    </div>
  );
};

export default Landing;
