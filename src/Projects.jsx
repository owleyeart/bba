// src/Projects.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

function Projects() {
  return (
    <div className="Projects-container">
      <h1>Projects</h1>
      <ul>
        <li>
          <Link to="/" className="home-link">← Home</Link>
        </li><p></p>
        <li>
          <Link to="/Projects/falling-away" className="Project-link">
            Falling Away
          </Link>
        </li>
        {/* Add more Project links here if needed */}
      </ul>
    </div>
  );
}

export default Projects;
