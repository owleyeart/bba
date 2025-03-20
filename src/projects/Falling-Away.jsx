// src/Projects/Falling-Away.jsx

import React, { useState, useRef } from 'react';
import './Falling-Away.css';

function FallingAway() {
  // Paths to your two images
  const topImage = '/images/falling-away-top.jpg';
  const bottomImage = '/images/falling-away-bottom.jpg';

  // 20 columns × 15 rows = 300 tiles
  const columns = 20;
  const rows = 15;
  const totalTiles = columns * rows; // 300

  // Each tile can be: 0 = normal, 1 = adjacent, 2 = fallen
  //  - normal (1.0 opacity)
  //  - adjacent (0.5 opacity)
  //  - fallen (0.0 opacity)
  const [tileStates, setTileStates] = useState(Array(totalTiles).fill(0));

  // We'll store timer references for each tile in a ref
  // so we can handle the fade-back logic after 3s, etc.
  const timersRef = useRef(
    Array.from({ length: totalTiles }, () => ({ fadeBack: null, adjacency: null }))
  );

  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    const tileWidth = rect.width / columns;
    const tileHeight = rect.height / rows;

    const col = Math.floor(localX / tileWidth);
    const row = Math.floor(localY / tileHeight);
    const tileIndex = row * columns + col;

    // If this tile is already fallen (2), do nothing
    if (tileStates[tileIndex] === 2) return;

    // Mark tile as fallen => triggers 0.5s fade out
    setTileStates((prev) => {
      if (prev[tileIndex] === 2) return prev; // already fallen

      const newArr = [...prev];
      newArr[tileIndex] = 2; // fallen
      return newArr;
    });

    // Set adjacency to 1 (0.5 opacity) for the 8 neighbors
    const neighbors = getNeighbors(tileIndex, columns, rows);
    setTileStates((prev) => {
      const newArr = [...prev];
      neighbors.forEach((n) => {
        // If neighbor is normal (0), set to adjacent (1).
        // If neighbor is already fallen (2), leave it alone.
        if (newArr[n] === 0) {
          newArr[n] = 1; 
        }
      });
      return newArr;
    });

    // Clear old timers for this tile
    if (timersRef.current[tileIndex].fadeBack) {
      clearTimeout(timersRef.current[tileIndex].fadeBack);
      timersRef.current[tileIndex].fadeBack = null;
    }
    // Clear adjacency timer if any
    if (timersRef.current[tileIndex].adjacency) {
      clearTimeout(timersRef.current[tileIndex].adjacency);
      timersRef.current[tileIndex].adjacency = null;
    }

    // After 0.5s, the tile is fully invisible => restore adjacency to normal
    // so neighbors return to 1.0 opacity if they were 0.5.
    timersRef.current[tileIndex].adjacency = setTimeout(() => {
      setTileStates((prev) => {
        const newArr = [...prev];
        neighbors.forEach((n) => {
          // If neighbor is still "adjacent" (1), revert to "normal" (0)
          if (newArr[n] === 1) {
            newArr[n] = 0;
          }
        });
        return newArr;
      });
    }, 500);

    // Then, 3s after being touched, fade the tile back in (another 0.5s)
    timersRef.current[tileIndex].fadeBack = setTimeout(() => {
      // Mark tile as normal => triggers fade in from 0.0 to 1.0 over 0.5s
      setTileStates((prev) => {
        const newArr = [...prev];
        newArr[tileIndex] = 0; // normal
        return newArr;
      });
    }, 9000);
  }

  return (
    <div className="falling-away-container">
      {/* Bottom image as background */}
      <div
        className="bottom-image"
        style={{ backgroundImage: `url(${bottomImage})` }}
      />

      {/* Top image in 300 tiles */}
      <div
        className="tiles-container"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove} // so touch/click also triggers
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {Array.from({ length: totalTiles }).map((_, i) => {
          const state = tileStates[i]; // 0..2
          // We'll map the numeric state to a CSS class or inline style
          return (
            <div
              key={i}
              className="tile"
              style={{
                backgroundImage: `url(${topImage})`,
                backgroundPosition: getTilePosition(i, columns, rows),
                opacity: state === 2 ? 0 : state === 1 ? 0.5 : 1
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Returns up to 8 adjacent neighbors of tile i in a 2D grid:
 *  (row-1, col-1), (row-1, col), (row-1, col+1)
 *  (row, col-1), (row, col+1)
 *  (row+1, col-1), (row+1, col), (row+1, col+1)
 */
function getNeighbors(index, columns, rows) {
  const row = Math.floor(index / columns);
  const col = index % columns;
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // skip self
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < columns) {
        neighbors.push(nr * columns + nc);
      }
    }
  }
  return neighbors;
}

/**
 * For tile i, row = i//columns, col = i%columns
 * 20 columns => background-size 2000% wide
 * 15 rows => background-size 1500% tall
 */
function getTilePosition(i, columns, rows) {
  const row = Math.floor(i / columns);
  const col = i % columns;
  const xPercent = (col * 100) / (columns - 1);
  const yPercent = (row * 100) / (rows - 1);
  return `${xPercent}% ${yPercent}%`;
}

export default FallingAway;
