///////////////////////////////////////////////////////
// PortraitCarousel.jsx – Bob Baker, April 2025
///////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const PortraitCarousel = ({ images = [] }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null); // ✅ Must be here at the top

  // ✅ Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        sliderRef.current?.slickNext();
      } else if (e.key === "ArrowLeft") {
        sliderRef.current?.slickPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!images.length) return <p>No portraits available.</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    beforeChange: (_, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}>
      <Slider ref={sliderRef} {...settings}>
        {images.map((img, i) => (
          <div key={i} onClick={() => { setOpen(true); setIndex(i); }}>
            <img
              src={img.url}
              alt={img.alt || `Portrait ${i + 1}`}
              style={{
                width: "100%",
                maxHeight: "65vh",
                objectFit: "contain",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </Slider>

      {/* 🔠 Caption below the dots */}
      <p style={{
        textAlign: "center",
        marginTop: "1rem",
        fontStyle: "italic",
        fontSize: "1rem",
        color: "#444",
      }}>
        {images[currentSlide]?.alt}
      </p>

      {/* 💡 Lightbox viewer */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img.url }))}
      />
    </div>
  );
};

export default PortraitCarousel;
