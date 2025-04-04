import React, { useEffect } from 'react';
import './Newsletter.css';

function Newsletter() {
  useEffect(() => {
    // Function to initialize MailerLite after script is loaded
    const initializeMailerLite = () => {
      if (window.ml) {
        window.ml('account', '1410242');
        // ✅ Re-scan the DOM and render the embedded form
        window.ml('forms', 'render');
      }
    };

    // Check if the MailerLite script is already present
    const existingScript = document.querySelector('script[src="https://assets.mailerlite.com/js/universal.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.mailerlite.com/js/universal.js';
      script.async = true;
      script.onload = initializeMailerLite;
      document.head.appendChild(script);
    } else {
      // Script already exists — re-init just in case
      initializeMailerLite();
    }
  }, []);

  return (
    <div className="newsletter-container">
      <h1 className="newsletter-title">Newsletter()</h1>
      <p>Subscribe to updates, events, and new exhibits.</p>

      {/* Embed container MailerLite will auto-fill */}
      <div className="ml-embedded" data-form="wpne7G"></div>
    </div>
  );
}

export default Newsletter;
