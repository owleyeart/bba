// src/Newsletter.jsx

import React, { useEffect } from 'react';
import './Newsletter.css';

function Newsletter() {
  useEffect(() => {
    // Prevent script from being added multiple times
    const existingScript = document.querySelector('script[src="https://assets.mailerlite.com/js/universal.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.mailerlite.com/js/universal.js';
      script.async = true;
      script.onload = () => {
        if (window.ml) {
          window.ml('account', '1410242');
        }
      };
      document.head.appendChild(script);
    } else {
      // If script already exists, re-initialize the form
      if (window.ml) {
        window.ml('account', '1410242');
      }
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
