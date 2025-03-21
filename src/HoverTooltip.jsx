import React, { useState } from 'react';

function HoverTooltip({ text, tooltipText }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Show tooltip on mouse enter
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  // Hide tooltip on mouse leave
  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Update tooltip position on mouse move
  const handleMouseMove = (e) => {
    setCoords({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ color: 'lightblue', cursor: 'default' }}
    >
      {text}

      {isVisible && (
        <div
          style={{
            position: 'fixed',
            // Position the tooltip slightly above & right of the cursor
            left: coords.x,
            top: coords.y - 40,

            backgroundColor: '#1e1e1e', // Dark background like VS Code
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
            pointerEvents: 'none', // So tooltip doesn't block mouse events
            zIndex: 9999,
            maxWidth: '300px',
            fontFamily: 'Consolas, monospace', // or your code-like font
            fontSize: '0.85rem',
          }}
        >
          {tooltipText}
        </div>
      )}
    </span>
  );
}

export default HoverTooltip;
