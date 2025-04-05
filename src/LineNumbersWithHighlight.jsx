import React, { useEffect, useState } from 'react';
import './LineNumbersWithHighlight.css';

function LineNumbersWithHighlight() {
  const LINE_HEIGHT_PX = 24;
  const [highlightLine, setHighlightLine] = useState(0);
  const [totalLines, setTotalLines] = useState(81);

  useEffect(() => {
    const updateLineCount = () => {
      const lines = Math.floor((window.innerHeight * 2) / LINE_HEIGHT_PX);
      setTotalLines(lines);
    };

    updateLineCount();
    window.addEventListener('resize', updateLineCount);
    return () => window.removeEventListener('resize', updateLineCount);
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector('.app-wrapper');
  
    const handleScroll = () => {
      const scrollY = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercent = scrollY / scrollHeight;
      const newHighlight = Math.floor(scrollPercent * totalLines);
      
      setHighlightLine(Math.min(newHighlight, totalLines - 1));
    };
  
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }
  
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [totalLines]);
  

  return (
    <div className="line-numbers">
      {Array.from({ length: totalLines }, (_, i) => (
        <div
          key={i}
          className={`line-number ${i === highlightLine ? 'highlighted' : ''}`}
        >
          {String(i + 1).padStart(2, ' ')}
        </div>
      ))}
    </div>
  );
}

export default LineNumbersWithHighlight;
