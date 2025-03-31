import React, { useEffect, useState } from 'react';

function LineNumbersWithHighlight() {
  const LINE_HEIGHT_PX = 24; // Must match your CSS line-height
  const [highlightLine, setHighlightLine] = useState(0);
  const [totalLines, setTotalLines] = useState(81); // default fallback

  useEffect(() => {
    const updateLineCount = () => {
      const lines = Math.floor((window.innerHeight * 2) / LINE_HEIGHT_PX);
      setTotalLines(lines);
    };

    updateLineCount();
    window.addEventListener('resize', updateLineCount);
    return () => window.removeEventListener('resize', updateLineCount);
  }, []);

  // 🎯 Scroll tracking effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      const scrollPercent = scrollY / scrollHeight;
      const newHighlight = Math.floor(scrollPercent * totalLines);

      setHighlightLine(Math.min(newHighlight, totalLines - 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init on load

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalLines]);

  const lines = Array.from({ length: totalLines }, (_, i) => {
    const isHighlighted = i === highlightLine;

    return (
      <div
        key={i}
        style={{
          paddingRight: '0.5rem',
          color: isHighlighted ? '#fc8b57' : '#858585',
          fontWeight: isHighlighted ? 'bold' : 'normal',
          textShadow: isHighlighted ? '0 0 6px rgba(252, 139, 87, 0.7)' : 'none',
        }}
      >
        {String(i + 1).padStart(2, ' ')}
      </div>
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '4rem',
        height: '100vh',
        backgroundColor: '#2d2d2d',
        color: '#858585',
        padding: '1rem 0',
        fontFamily: 'Consolas, monospace',
        fontSize: '0.9rem',
        lineHeight: `${LINE_HEIGHT_PX}px`,
        textAlign: 'right',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {lines}
    </div>
  );
}

export default LineNumbersWithHighlight;
