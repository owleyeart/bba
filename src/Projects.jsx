// src/Projects.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

function Projects() {
  return (
    <div className="Projects-container">
      <h1>Projects</h1>
      <ul>
        {/* Home link */}
        <li>
          <Link to="/" className="home-link">← Home</Link>
        </li>

        {/* NEW: Portfolio link, above Falling Away */}
        <li>
          <p>

        </p>
          <Link to="https://www.owleyeart.com/artists/bob-baker" className="Project-link">
            Portfolio
          </Link>
          <p>

          </p>
        </li>

        {/* Existing: Falling Away link */}
        <li>
          <Link to="/Projects/falling-away" className="Project-link">
            Falling Away
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Projects;
