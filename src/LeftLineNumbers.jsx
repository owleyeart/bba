// src/LeftLineNumbers.jsx
import React from 'react';

function LeftLineNumbers() {
  // For example, 50 lines:
  const lines = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div style={styles.container}>


      {lines.map((num) => (
        <div key={num} style={styles.line}>
          {num}
        </div>
      ))}
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
    paddingRight: '0.5rem',
    textAlign: 'right',
    /* Instead of overflow: 'auto', do overflow: 'hidden' */
    overflow: 'hidden',
    zIndex: 9999,
  },
  line: {
    opacity: 0.6,
    padding: '0 0.5rem',
  },
};

export default LeftLineNumbers;
