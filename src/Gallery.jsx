// src/Gallery.jsx

import React from "react";

const Gallery = () => {
  return (
    <div className="gallery-page" style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <iframe
        src="https://bobphotography9.zenfoliosite.com"
        title="Zenfolio Gallery"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default Gallery;
