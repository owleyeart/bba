// src/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

import HoverTooltip from './HoverTooltip';
import LineNumbersWithHighlight from './LineNumbersWithHighlight';

function About() {
  return (
    <>
      <LineNumbersWithHighlight />

      <div style={{ marginLeft: '5rem', padding: '1rem' }} className="about-container">
        <h1 className="function-title">
          <HoverTooltip
            text={<span>{'About()'}</span>}
            tooltipText="This is an About page. (Information about the artist)."
          />
        </h1>

        <p>
          <Link to="/" className="home-link">
            <HoverTooltip
              text={<span>{'return ('}</span>}
              tooltipText="(Go Back Home) Return:(Home Page);"
            />
          </Link>
        </p>

        <ul>
          <li>
            <HoverTooltip
              text={<span className="syntax-orange">{'{ "Home" }'}</span>}
              tooltipText="Return to Home Page"
            />
          </li>
        </ul>

        <p>
          Welcome to the <span className="syntax-tag">{'<strong>'}</span>About<span className="syntax-tag">{'</strong>'}</span> page!
        </p>

        <p className="code-snippet">
          {'<span style={{ color: "Violet" }}>"About the Artist"</span>'}
        </p>

        <h3 className="main-function">About the Artist</h3>
        <h1 className="function-title">
          <HoverTooltip
            text={<span>{'Bob.Baker()'}</span>}
            tooltipText="The main function."
          />
        </h1>

        <p className="console-effect">
          <span className="syntax-purple">console</span>
          <span className="syntax-yellow">.</span>
          <span className="syntax-blue">log</span>
          <span className="syntax-yellow">(</span>
          <span className="syntax-quote">"Art is the closest thing to time travel."</span>
          <span className="syntax-yellow">)</span>
        </p>

        <p className="console-log">
          ///Just a time traveler remembering their way back home.
        </p>

        <p>
          <span className="syntax-orange">Professional Organizations</span><br />
          <span className="syntax-purple">—KCSCP</span> <span className="syntax-yellow">(Member, 2022–current)</span><br />
          Kansas City Society of Contemporary Photography<br />
          <Link to="https://www.kcscp.org" className="home-link">https://www.kcscp.org</Link>
        </p>

        <p>
          <span className="syntax-purple">—Images Art Gallery</span> <span className="syntax-yellow">(Co-Op Member, 2025–current)</span><br />
          Member of local artist co-op —Images Art Gallery— with work on display and for sale.<br />
          <Link to="https://www.imagesgallery.org" className="home-link">https://www.imagesgallery.org</Link>
        </p>

        <p>
          <span className="syntax-purple">—Exhibitions:</span><br />
          November 1 – December 20, 2024 — KCSCP "Current Works" exhibit at the Leedy-Voulkos Art Center in Kansas City's Crossroads District.<br />
          Bob currently has work on display at Images Art Gallery in downtown Overland Park, Kansas.
        </p>

        <p>
          <span className="syntax-tag">{'</div>'}</span><br />
          <span className="syntax-purple">{');'}</span><br />
          <span className="syntax-yellow">{'}'}</span>
        </p>

        <p style={{ marginTop: '40vh', fontStyle: 'italic', color: '#ffffff' }}></p>

        <span className="error-easter-egg">
          <pre>
{`> run timeline.sh

[ ██████████████████████████████ ] 99%

⚠ Error 27: Artistic Overflow
Trace: reality/index.js → dimension.jsx → soul.log

💥 Compilation halted.
🕳️ Recursive meaning loop detected.`}
          </pre>
        </span>
      </div>
    </>
  );
}

export default About;
