// src/Projects.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import HoverTooltip from './HoverTooltip';
import LineNumbersWithHighlight from './LineNumbersWithHighlight';
import Header from './Header';

function Projects() {
  return (
    <>
          <Header />
      <LineNumbersWithHighlight />

      <div className="page-container" style={{ marginLeft: '5rem', padding: '1rem' }}>
        {/* 🔁 Return block moved above header */}
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
              text={
                <span style={{ color: 'orange' }}>
                  <Link to="/" className="home-link">{'{ "Home" }'}</Link>
                </span>
              }
              tooltipText="Return to homepage."
            />
          </li>
        </ul>

        {/* 🔻 Projects() header appears after return-to-home block */}
        <h1 className="function-title">
          <HoverTooltip
            text={<span style={{ color: 'lightskyblue' }}>Projects()</span>}
            tooltipText="Function: Displays all current projects."
          />
        </h1>
        <br /><br />
        
        The following projects are available to view:
        
        <br />
        <ul>
          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
  text={
    <Link to="/observed-light" className="project-link">
      {'{ "Observed Light" }'}
    </Link>
  }
  tooltipText="View the Observed Light project."
/> &nbsp; View the exhibit, order the book, "Observed Light"
          </li><br />

          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
  text={
    <Link to="/Projects/falling-away" className="project-link">
      {'{ "Falling Away" }'}
    </Link>
  }
  tooltipText="View the Falling Away project."
/> &nbsp; A work in progress, puzzle-piece falling JavaScript.
          </li><br />

          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
  text={
    <Link to="/About" className="project-link">
      {'{ "About Page Code Project" }'}
    </Link>
  }
  tooltipText="View the About Page project."
/> &nbsp; First ever About page styled like a JSX code editor!
          </li><br />
        </ul>

        <p className="console-log">// More projects coming soon...</p>
        <p><span className="syntax-yellow">{'}'}</span></p>
      </div>
    </>
  );
}

export default Projects;
