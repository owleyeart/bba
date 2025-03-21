// src/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './About.css'; // We'll style it like code

import HoverTooltip from './HoverTooltip';
import LineNumbersWithHighlight from './LineNumbersWithHighlight';

function About() {
  return (
    <>
      {/* 1) Render the line-number column on the left */}
      <LineNumbersWithHighlight />

      {/* 2) Shift the main content to the right, so it doesn’t overlap */}
      <div style={{ marginLeft: '5rem', padding: '1rem' }} className="about-container">
        <h1>About()</h1>
        <p>
          <HoverTooltip
            text={<span style={{ color: 'Violet' }}>{"return ("}</span>}
            tooltipText="(Go Back Home) Return.(to: Home Page);"
          />
        </p>

        <ul>
          <li>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <HoverTooltip
              text={
                <span style={{ color: 'orange' }}>
                  <Link to="/" className="home-link">
                    { "{ \"Home\" }" }
                  </Link>
                </span>
              }
              tooltipText="(Go Back Home) Return.(to: Home Page);"
            />
            <Link to="/" className="home-link"></Link>
            <br />
            <br />
          </li>
        </ul>

        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;{"Welcome to the "}
          {"<"}
          <span style={{ color: 'lightblue' }}>{"strong"}</span>
          {">"}
          {"About"}
          {"</"}
          <span style={{ color: 'lightblue' }}>{"strong"}</span>
          {">"}{" page! "}
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;This is where you can describe your background,
          <br />
          &nbsp;&nbsp;&nbsp;your art journey, or anything else you'd like to share.
        </p>

        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;{"Styled to look like "}
          {"<"}
          <span style={{ color: 'lightblue' }}>{"em"}</span>
          {">"}
          {"code"}
          {"</"}
          <span style={{ color: 'lightblue' }}>{"em"}</span>
          {">"}—using a
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;monospaced font, dark background, and syntax-inspired colors.
        </p>

        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;{"<"}
          <HoverTooltip
            text={<span style={{ color: 'lightskyblue' }}>{"span style"}</span>}
            tooltipText="(property) React.JSX.IntrinsicElements.span: React.DetailedHTMLProps"
          />
          {"="}
          <span style={{ color: 'blue' }}>{"{"}</span>
          <span style={{ color: 'yellow' }}>{"{ "}</span>

          <HoverTooltip
            text={<span style={{ color: 'lightblue' }}>{"color: "}</span>}
            tooltipText="(property) StandardLonghandProperties<string | number, string & {}>.color?: Property.Color | undefined
The color CSS property sets the foreground color value..."
          />

          <span style={{ color: "#fc8b57" }}>{"'Violet' "}</span>
          <span style={{ color: 'yellow' }}>{"}"}</span>
          <span style={{ color: 'blue' }}>{"}"}</span>
          {">"}{" "}
          <span style={{ color: "#fc8b57" }}>{"{\"About the Artist\"}"}</span>

          <HoverTooltip
            text={<span style={{ color: 'lightskyblue' }}>{"</span>"}</span>}
            tooltipText="(property) React.JSX.IntrinsicElements.span: React.DetailedHTMLProps"
          />
          <br />
          <br />
          <h3>
            <span style={{ color: 'Violet' }}>About the Artist</span>
          </h3>
          <h1>Bob.Baker()</h1>
          "Just a time traveler remembering their way back home."
          <br />
          <br />

          <span style={{ color: 'Orange' }}>Professional Organizations:</span>
          <br />
          <span style={{ color: 'Violet' }}>—KCSCP</span>{" "}
          <span style={{ color: 'Yellow' }}>(Member, 2022-current) </span>
          <br />
          Kansas City Society of Contemporary Photography
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <HoverTooltip
            text={
              <span style={{ color: 'orange' }}>
                <Link to="/" className="home-link">
                  {"https://www.KCSCP.org"}
                </Link>
              </span>
            }
            tooltipText="Kansas City Society of Contemporary Photography (URL)."
          />
          <br />
          <br />

          <span style={{ color: 'Violet' }}>—Images Art Gallery </span>
          <span style={{ color: 'Yellow' }}>(Co-Op Member, 2024-current) </span>
          <br />
          Member of local artist co-op —Images Art Gallery— with work on display,
          and for sale.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <HoverTooltip
            text={
              <span style={{ color: 'orange' }}>
                <Link to="/" className="home-link">
                  {"http://www.imagesgallery.org"}
                </Link>
              </span>
            }
            tooltipText="Images Art Gallery website (URL)."
          />
          <br />
          <br />

          <span style={{ color: 'Violet' }}>—Exhibitions:</span>
          <br />
          November 1 - December 20, 2024 — KCSCP "Current Works 2024" exhibit at
          the Leedy-Voulkos Art Center in the Crossroads District of downtown
          Kansas City. Bob has current work displayed at Images Art Gallery in
          downtown Overland Park, Kansas.
          <br />
          <br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <HoverTooltip
            text={<span style={{ color: 'lightskyblue' }}>{"</div>"}</span>}
            tooltipText="(property) React.JSX.IntrinsicElements.div: React.DetailedHTMLProps<React"
          />
          <br />
          <br />
          &nbsp;&nbsp;<span style={{ color: 'Violet' }}>{");"}</span>
          <br />
          <br />
          <span style={{ color: 'yellow' }}>{"}"}</span>
        </p>
      </div>
    </>
  );
}

export default About;
