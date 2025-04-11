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

      <div className="about-container">

        {/* 🏠 Return Home Block */}
        <span className="inline-block">
        <Link to="/" className="home-link">
            <HoverTooltip
              text={<span>{'return ('}</span>}
              tooltipText="(Go Back Home) Return:(Home Page);"
            />
          </Link>
        </span>

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

        {/* ✍️ Modular Bio Blocks */}
        <p className="console-log">// One-liner</p>
        <p className="syntax-quote">"Bob Baker is an experimental photographer exploring light as language to evoke story, mood, and meditation."</p>
        <br />

        <p className="console-log">// Short Bio</p>
        <p>
          Based in Overland Park, Kansas, Bob Baker is an experimental photographer who bends and shapes light to tell stories and spark daydreams.
          Inspired by the greats of street and abstract art alike, his work serves as both meditation and message.
        </p>
        <br />

        <p className="console-log">// Full Bio</p>
        <p>
          Bob Baker is an experimental photographer based in Overland Park, Kansas, seeking ways to bend and shape light to form stories and evoke daydreams.
          His work draws from a wide spectrum of influences—Henri Cartier-Bresson's decisive moments, Daido Moriyama’s gritty candor, Vivian Maier’s quiet brilliance,
          Rothko’s emotional color fields, Matisse and Van Gogh’s expressive lines, and the immersive soundscapes of Tool, Glass Beams, and Carbon Based Lifeforms.
        </p>
        <p>
          Bob approaches photography as both a meditation and a therapeutic practice—a means of observing the world with intention and offering back moments of insight,
          mystery, and connection. He is deeply interested in physics, philosophy, art history, and spirituality, and weaves these threads through his images and process.
          Whether capturing fleeting human gestures or abstract textures of light, Bob’s work invites viewers into a layered dialogue—between self and subject,
          moment and memory, observer and the observed.
        </p>
        <br />

        {/* 🕰️ Console Quote */}
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

        {/* 📌 Other Info */}
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

        {/* 📦 Closing */}
        <p>
          <span className="syntax-tag">{'</div>'}</span><br />
          <span className="syntax-purple">{');'}</span><br />
          <span className="syntax-yellow">{'}'}</span>
        </p>

        <div className='error-easter-egg'>
        <span>
          <pre>
{`Windoors TurtleShell
Copyright (C) Bob Baker. All right reserved.

TS D:\\OneDrive - BobBakerArt\\frontend> run timeline.sh

[ ██████████████████████████████ ] 99%

⚠ Error 27: Artistic Overflow
Trace: reality/index.js → dimension.jsx → soul.log

💥 Compilation halted.
🕳️ Recursive meaning loop detected.`}
          </pre>
        </span>
      </div>
      <div style={{ height: "6rem" }} />
      </div>

    </>
  );
}

export default About;
