// src/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Header from './Header';

import HoverTooltip from './HoverTooltip';
import LineNumbersWithHighlight from './LineNumbersWithHighlight';

function About() {
  return (
    <>
    <Header />
      <LineNumbersWithHighlight />

      <div style={{ marginLeft: '5rem', padding: '1rem' }} className="page-container">
        
        {/* 🏠 Return Home Block - Moved Above About() */}
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
              text={
                <Link to="/" className="home-link syntax-orange">
                  {'{ "Home" }'}
                </Link>
              }
              tooltipText="Return to Home Page"
            />
          </li>
        </ul>

        {/* 🔻 About() function title */}
        <h1 className="function-title">
          <HoverTooltip
            text={<span>{'About()'}</span>}
            tooltipText="This is an About page. (Information about the artist)."
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
        <br /><br /><br />
        <p>
          <span className="syntax-orange">Professional Organizations</span><br />
          <span className="syntax-purple">—KCSCP</span> <span className="syntax-yellow">(Member, 2022–current)</span><br />
          Kansas City Society of Contemporary Photography<br />
          <Link to="https://www.kcscp.org" className="home-link">https://www.kcscp.org</Link>
        </p>
        <br />
        <p>
          <span className="syntax-purple">—Images Art Gallery</span> <span className="syntax-yellow">(Co-Op Member, 2025–current)</span><br />
          Member of local artist co-op —Images Art Gallery— with work on display and for sale.<br />
          <Link to="https://www.imagesgallery.org" className="home-link">https://www.imagesgallery.org</Link>
        </p>
        <br />
        <p>
          <span className="syntax-orange">—Exhibitions:</span><br />

          <strong>April 16 - May 10, 2025 — "Observed Light"</strong><br />Exhibit at Images Art Gallery in Historic Downtown Overland Park, Kansas. <br /><br />

          <strong>November 1 – December 20, 2024 — KCSCP "Current Works"</strong><br />Exhibit at the Leedy-Voulkos Art Center in Kansas City's Crossroads District.<br />
          <br />Bob currently has work on display at Images Art Gallery in downtown Overland Park, Kansas.
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
