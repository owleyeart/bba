// src/Newsletter.jsx

import React, { useEffect } from 'react';
import './Newsletter.css';

function Newsletter() {
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://assets.mailerlite.com/js/universal.js"]');
  
    const initializeMailerLite = () => {
      if (window.ml) {
        window.ml('account', '1410242');
        window.ml('form', 'wpne7G'); // ⬅️ Force form initialization
      }
    };
  
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.mailerlite.com/js/universal.js';
      script.async = true;
      script.onload = () => {
        initializeMailerLite();
      };
      document.head.appendChild(script);
    } else {
      initializeMailerLite(); // Already exists, initialize again
    }
  }, []);
  

  return (
    <div className="newsletter-page">
      <h1 className="newsletter-title">Newsletter()</h1>
      <p className="newsletter-description">// Subscribe for updates, behind-the-scenes, and art show invites.</p>

      {/* Your actual MailerLite embed */}
      <div className="ml-embedded" data-form="wpne7G"></div>
    </div>
  );
}

export default Newsletter;
