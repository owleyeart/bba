// src/Contact.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css'; // We'll style it similarly to Projects

function Contact() {
  return (
    <div className="Contact-container">
      <h1>Contact</h1>
      <ul>
        <li>
          {/* Smaller "← Home" link, just like Projects */}
          <Link to="/" className="home-link">← Home</Link>
        </li>
      </ul>

      <p>
        If you have any questions or would like to get in touch, please email me at:
        <br />
        <strong>bob.baker@example.com</strong>
      </p>

      <p>
        Or find me on social media:
        <br />
        <a href="https://twitter.com/YourProfile" target="_blank" rel="noreferrer">
          Twitter
        </a>
        {' | '}
        <a href="https://instagram.com/YourProfile" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
    </div>
  );
}

export default Contact;
