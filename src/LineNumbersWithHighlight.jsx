// Example: Global approach
import React, { useState, useEffect } from 'react';

function LineNumbersWithHighlight() {
  const totalLines = 50;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const LINE_HEIGHT = 20;

  useEffect(() => {
    function handleMouseMove(e) {
      // Optionally add window.scrollY if you want to track scrolled position
      const y = e.clientY; 
      const index = Math.floor(y / LINE_HEIGHT);
      if (index >= 0 && index < totalLines) setHoveredIndex(index);
      else setHoveredIndex(null);
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={styles.container}>
      {Array.from({ length: totalLines }, (_, i) => i + 1).map((num, i) => {
        const isHovered = i === hoveredIndex;
        return (
          <div key={num} style={{
            ...styles.line,
            backgroundColor: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}>
            {isHovered && <span style={styles.redDot}>●</span>}
            <span style={{ marginLeft: isHovered ? 4 : 0 }}>{num}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3rem',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    fontFamily: 'Consolas, monospace',
    fontSize: '0.9rem',
    textAlign: 'right',
    userSelect: 'none',
    overflow: 'hidden',
    zIndex: 9999,
  },
  line: {
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '0.5rem',
  },
  redDot: {
    color: 'red',
    marginRight: 2,
  },
};

export default LineNumbersWithHighlight;
