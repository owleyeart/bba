///////////////////////////////////////////////////////
// Portraits.jsx – Styled to match About.css
///////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import PortraitCarousel from "./components/PortraitCarousel";
import CallToAction from "./components/CallToAction";
import "./About.css"; // ✅ Using shared styles

console.log("⚠️ Portraits component is rendering");


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";


const Portraits = () => {
  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/pages?filters[slug][$eq]=portraits")
      .then((res) => res.json())
      .then((data) => {
        const raw = data?.data?.[0];
        if (raw) {
          setPageData(raw.attributes || raw);
        }
      })
      .catch((err) => console.error("❌ Page data error:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:1337/api/portrait-images?populate=*")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) {
          const sorted = data.data.sort((a, b) => {
            const orderA = parseInt(a?.Order ?? 0);
            const orderB = parseInt(b?.Order ?? 0);
            return orderA - orderB;
          });

          const formatted = sorted
            .map((img) => {
              const imageUrl = img?.image?.url;
if (!imageUrl) return null;

return {
  id: img.id,
  url: `${API_URL}${imageUrl}`,
  alt: img.title || "Portrait",
};

            })
            .filter(Boolean);

          setImages(formatted);
        }
      })
      .catch((err) => console.error("❌ Image fetch error:", err));
  }, []);

  if (!pageData) return <p className="console-log">// loading portraits...</p>;

  const { title = "Portraits", content = "" } = pageData;

  return (
    <div className="about-container">
      {/* Main Header */}
      <h1 className="main-function">Portraits()</h1>

      {/* Strapi Dynamic Page Content */}
      <div
        className="console-log"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* CTA Button */}
      <a href="/book" className="link">
        Book a Portrait
      </a>

      {/* Carousel */}
      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <PortraitCarousel images={images} />
      </div>

      {/* Quote Block */}
      <div className="quote">
        A portrait is more than a likeness — it’s a mirror of time, love, and the stories we carry.  
        I’ve learned that the most powerful portraits are the ones where people feel seen.  
        My job is to help them get there.
        <br />
        — Bob Baker
      </div>

      {/* What to Expect */}
      <div className="console-log">
        <ul>
          <li><span className="syntax-purple">💬 Consultation:</span> We'll discuss your ideas and intentions.</li>
          <li><span className="syntax-purple">📸 The Session:</span> Relaxed, creative, and collaborative.</li>
          <li><span className="syntax-purple">🖼️ The Reveal:</span> You choose your favorite portraits.</li>
          <li><span className="syntax-purple">📦 Delivery:</span> Digital files and optional prints.</li>
        </ul>
      </div>

      {/* Reusable Call to Action */}
      <CallToAction />
    </div>
  );
};

export default Portraits;
