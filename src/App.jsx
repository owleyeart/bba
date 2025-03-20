import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const images = [
  '/images/20240907_303_OWL0880.jpg',
  '/images/20241013_303_OWL1733.jpg',
  '/images/20250304_303_OWL4767.jpg',
  '/images/20230222_303_OWL6609.jpg',
  '/images/20250304_303_OWL4775.jpg',
  '/images/20230814_303_OWL4849.jpg',
  '/images/20240701_303_OWL8456.jpg',
  '/images/20160220_303_TIN3228.jpg',
  '/images/20250303_303_OWL4733.jpg',
  '/images/20240619_303_OWL8024.jpg',
  '/images/20240907_303_OWL0886.jpg',



];

function App() {
  const containerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgPosX, setBgPosX] = useState(50);

  // Pointer/drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [initialPosX, setInitialPosX] = useState(50);

  // Direction lock: "none" | "horizontal" | "vertical"
  const [dragDirection, setDragDirection] = useState("none");

  // Thresholds
  const DRAG_DIRECTION_THRESHOLD = 20;
  const VERTICAL_SWIPE_THRESHOLD = 50;

  // --------------------------------
  // FADE-IN/OUT LOGIC FOR CONTROLS
  // --------------------------------
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef(null);

  // Show controls and schedule them to hide after inactivity
  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    // Hide again after 2 seconds of no interaction
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 900);
  };

  // Cleanup any timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // ---------------------------
  // Pointer Down
  // ---------------------------
  const handlePointerDown = (e) => {
    showControls(); // show controls on any pointer interaction
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setInitialPosX(bgPosX);
    setDragDirection("none");
  };

  // ---------------------------
  // Pointer Move
  // ---------------------------
  const handlePointerMove = (e) => {
    showControls(); // show controls on pointer move

    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Hover logic (mouse-only) if not dragging
    if (!isDragging) {
      const ratio = e.clientX / containerWidth;
      let newPosX = ratio * 100;
      newPosX = Math.max(0, Math.min(100, newPosX));
      setBgPosX(newPosX);
      return;
    }

    // Drag logic with direction lock
    if (dragDirection === "none") {
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD
      ) {
        setDragDirection("horizontal");
      } else if (
        Math.abs(deltaY) > Math.abs(deltaX) &&
        Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD
      ) {
        setDragDirection("vertical");
      }
    }

    if (dragDirection === "horizontal") {
      const deltaPercent = (deltaX / containerWidth) * 100;
      let newPosX = initialPosX + deltaPercent;
      newPosX = Math.max(0, Math.min(100, newPosX));
      setBgPosX(newPosX);
    }
  };

  // ---------------------------
  // Pointer Up / Leave
  // ---------------------------
  const handlePointerUpOrLeave = (e) => {
    showControls();

    if (!isDragging) return;
    setIsDragging(false);

    // If we ended a vertical drag, decide if we switch images
    if (dragDirection === "vertical") {
      const deltaY = e.clientY - startY;
      if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
        if (deltaY < 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
    setDragDirection("none");
  };

  // ---------------------------
  // Wheel Event
  // ---------------------------
  const handleWheel = (e) => {
    showControls(); // show controls on wheel scroll

    if (e.deltaY > 0) {
      nextImage();
    } else {
      prevImage();
    }
  };

  // ---------------------------
  // Next / Prev Helpers
  // ---------------------------
  const nextImage = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next < images.length ? next : images.length - 1;
    });
    setBgPosX(50);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      return next >= 0 ? next : 0;
    });
    setBgPosX(50);
  };

  return (
    <div
      className="landing-container"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      onWheel={handleWheel}
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundPosition: `${bgPosX}% center`
      }}
    >
      {/* Hamburger menu */}
      <button className="hamburger-menu" aria-label="Open Menu">
        &#9776;
      </button>

      {/* 
        CONTROLS 
        - Fade in/out via "opacity: controlsVisible ? 1 : 0"
        - Transition set in CSS
      */}
      <div
        className="controls"
        style={{ opacity: controlsVisible ? 1 : 0 }}
      >
        <div className="column next-col">
          <span className="arrow up">↑</span>
          <span className="label next-label">Scroll</span>
          <span className="arrow down">↓</span>
        </div>
        <div className="column pan-col">
          <div className="pan-row">
            <span className="arrow left">←</span>
            <span className="label pan-label">Pan</span>
            <span className="arrow right">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
