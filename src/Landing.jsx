import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Landing.css';

const images = [

  '/images/20240902_303_OWL0639.jpg',
  '/images/20240725_303_OWL9909.jpg',
  '/images/20240725_303_OWL9897.jpg',
  
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
  const [controlsVisible, setControlsVisible] = useState(false);

  const DRAG_DIRECTION_THRESHOLD = 20;
  const VERTICAL_SWIPE_THRESHOLD = 50;
  const SCROLL_COOLDOWN = 500;

  const hideTimerRef = useRef(null);
  const lastWheelTimeRef = useRef(0);

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

  const handleDotClick = (index) => {
    const dot = document.getElementById(`dot-${index}`);
    if (dot) {
      dot.classList.remove('ripple');
      void dot.offsetWidth;
      dot.classList.add('ripple');
      setTimeout(() => {
        dot.classList.remove('ripple');
      }, 1200);
    }
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
      className={`landing-container ${currentIndex === 0 ? 'first-block' : ''}`}
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
      <div className={`landing-content ${fadeClass}`}>
        <div className="floating-dots">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              id={`dot-${i}`}
              className={`dot dot-${i + 1}`}
              onClick={() => handleDotClick(i)}
              aria-current={i === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>



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
          <div>
              <div><h3>Bob Baker</h3></div>
              <div>Artist</div>
            </div>
          )}

          {currentIndex === 1 && (
          <div>
              <div><h3>Exploring light</h3></div>
              <div>to evoke emotion</div>
            </div>
          )}

          {currentIndex === 2 && (
           <div>
              <div><h3>Journeying and Learning</h3></div>
              <div>Through hard work, to the stars.</div>
            </div>
          )}
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
            <line x1="0" y1="50" x2="1440" y2="50" stroke="white" strokeWidth="2" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default Landing;
