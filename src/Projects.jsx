// src/Projects.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import HoverTooltip from './HoverTooltip';
import LineNumbersWithHighlight from './LineNumbersWithHighlight';

function Projects() {
  return (
    <>
      <LineNumbersWithHighlight />

      <div className="projects-container" style={{ marginLeft: '5rem', padding: '1rem' }}>
        <h1 className="function-title">
          <HoverTooltip
            text={<span style={{ color: 'lightskyblue' }}>Projects()</span>}
            tooltipText="Function: Displays all current projects."
          />
        </h1>

        <p>
          <Link to="/" className="home-link">
            <HoverTooltip
              text={<span style={{ color: 'violet' }}>return (</span>}
              tooltipText="Return to home."
            />
          </Link>
        </p>

        <ul>
          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
              text={<span style={{ color: 'orange' }}>
                <Link to="/" className="home-link">{'{ "Home" }'}</Link>
              </span>}
              tooltipText="Return to homepage."
            />
          </li>

          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
              text={<span style={{ color: 'orange' }}>
                <a href="https://www.owleyeart.com/artists/bob-baker" className="project-link" target="_blank" rel="noreferrer">
                  {'{ "Portfolio" }'}
                </a>
              </span>}
              tooltipText="External portfolio on OwlEyeArt.com"
            />
          </li>

          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
              text={<span style={{ color: 'orange' }}>
                <Link to="/Projects/falling-away" className="project-link">{'{ "Falling Away" }'}</Link>
              </span>}
              tooltipText="View the Falling Away project."
            />
          </li>
        </ul>

        <p className="console-log">// More projects coming soon...</p>
        <p><span className="syntax-yellow">{'}'}</span></p>
      </div>
    </>
  );
}

export default Projects;
