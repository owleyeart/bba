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
        <Link to="mailto:bob@bobbaker.art">bob@bobbaker.art</Link>
      </p>

      <p>
        Or find me on social media:
        <br />
        <a href="https://www.threads.net/@owleyeart" target="_blank" rel="noreferrer">
          Threads
        </a>
        {' | '}
        <a href="https://instagram.com/owleyeart" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
    </div>
  );
}

export default Contact;
