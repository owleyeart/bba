import React, { useState, useRef, useEffect } from 'react';

import './styles/Landing.css';

const images = [

  '/images/20240902_303_OWL0639.jpg',
  '/images/20240725_303_OWL9909.jpg',
  '/images/20250324_303_OWL5570.jpg',
  '/images/20250429_303_OWL6695.jpg',
  '/images/20240725_303_OWL9897.jpg',
  '/images/20240720_303_OWL9829.jpg',
  '/images/20240704_303_OWL8744.jpg',
  '/images/20240627_303_OWL8355.jpg',
  '/images/20240615_303_OWL7727.jpg',
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

    </div>
  );
};

export default Landing;
