import React, { useEffect } from 'react';
import './Newsletter.css'; // optional styling

function Newsletter() {
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://assets.mailerlite.com/js/universal.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.mailerlite.com/js/universal.js';
      script.async = true;
      script.onload = () => {
        window.ml && window.ml('account', '1410242');
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="newsletter-container">
      <h1 className="newsletter-title">Newsletter()</h1>
      <p>Subscribe to updates, events, and new exhibits.</p>
      
      {/* ✅ MailerLite will find this and render the form automatically */}
      <div className="ml-embedded" data-form="wpne7G"></div>
    </div>
  );
}

export default Newsletter;
