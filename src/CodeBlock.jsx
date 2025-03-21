// src/CodeBlock.jsx
import React from 'react';

function CodeBlock({ lines }) {
  return (
    <div style={styles.container}>
      {/* Left column: line numbers */}
      <div style={styles.lineNumberColumn}>
        {lines.map((_, index) => (
          <div key={index} style={styles.lineNumber}>
            {index + 1}
          </div>
        ))}
      </div>

      {/* Right column: actual text lines */}
      <div style={styles.codeColumn}>
        {lines.map((line, index) => (
          <div key={index} style={styles.codeLine}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#1e1e1e', // Dark background, like VS Code
    color: '#d4d4d4',
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '0.9rem',
    padding: '1rem',
    borderRadius: '4px',
  },
  lineNumberColumn: {
    textAlign: 'right',
    marginRight: '1rem',
    userSelect: 'none', // so user doesn't highlight line numbers
  },
  lineNumber: {
    opacity: 0.6, // slightly dim
  },
  codeColumn: {
    flex: 1,
  },
  codeLine: {
    whiteSpace: 'pre', // preserve spacing if it's code-like
  },
};

export default CodeBlock;
