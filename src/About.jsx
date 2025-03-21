// src/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './about.css'; // We'll style it like code

function About() {
  return (
    <div className="about-container">
      <h1>About()</h1>
      <p>
      <span style={{ color: "violet"}}>
      &nbsp;&nbsp;{ "return (" }
        </span>

      </p>
      <ul>
        <li>     &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/" className="home-link">
 
          { "{ \"Home\" }" }
          </Link><br></br><br></br>
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
      {">"}
      {" page! "}<br></br>

      &nbsp;&nbsp;&nbsp;&nbsp;This is where you can describe your
  background, <br></br>
  &nbsp;&nbsp;&nbsp;
  your art journey, or anything else you'd like to share.
      </p>
      <p>

      &nbsp;&nbsp;&nbsp;&nbsp;{"Styled to look like "}
      {"<"}
      <span style={{ color: 'lightblue' }}>{"em"}</span>
      {">"}
      {"code"}
      {"</"}
      <span style={{ color: 'lightblue' }}>{"em"}</span>
      {">"}
      
      —using a 
      <br>
      </br>&nbsp;&nbsp;&nbsp;&nbsp;monospaced font, dark background, and syntax-inspired colors.
</p>
<p>

&nbsp;&nbsp;&nbsp;&nbsp;{"<"}
      <span style={{ color: 'lightskyblue' }}>{"span style"}</span>
      {"="}
      <span style={{ color: 'blue' }}>{"{"}</span><span style={{ color: 'yellow' }}>{"{ "}</span><span style={{ color: 'lightblue' }}>{"color: "}</span><span style={{ color: "#fc8b57" }}>{"\'Violet\' "}</span><span style={{ color: 'yellow' }}>{"}"}</span><span style={{ color: 'blue' }}>{"}"}</span>
      {">"} <span style={{ color: "#fc8b57" }}>{"{\"About the Artist\"}"}</span><span style={{ color: 'lightskyblue' }}>{"<\/span>"}</span>
      <br></br><br></br>
      <h3>
      <span style={{ color: 'Violet' }}>About the Artist</span></h3>
<h1>Bob.Baker()</h1>
"Just a time traveler remembering their way back home."

<br>
</br>
<br>
</br>

<span style={{ color: 'Orange' }}>Professional Organizations:</span><br>
</br>

<span style={{ color: 'Violet' }}>—KCSCP</span> <span style={{ color: 'Yellow' }}>(Member, 2022-current) </span>
<br></br>Kansas City Society of Contemporary Photography
<br></br>      &nbsp;&nbsp;&nbsp;&nbsp;
<Link to="/" className="home-link">
      https://www.kcscp.org/
          </Link>
          <br>
</br><br>
</br>

<span style={{ color: 'Violet' }}>—Images Art Gallery </span><span style={{ color: 'Yellow' }}>(Co-Op Member, 2024-current) </span>
<br></br>Member of local artist co-op —Images Art Gallery— with work on display, and for sale.
<br></br>      &nbsp;&nbsp;&nbsp;&nbsp;
<Link to="/" className="home-link">
      https://www.kcscp.org/
          </Link><br>
</br><br>
</br>


<span style={{ color: 'Violet' }}>—Exhibitions:</span>
<br></br>

November 1 - December 20, 2024 — KCSCP "Current Works 2024" exhibit at the Leedy-Voulkos Art Center in the Crossroads District of downtown Kansas City.
Bob has current work displayed at Images Art Gallery in downtown Overland Park, Kansas.



      <br></br><br></br>      <br></br><br></br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'lightskyblue' }}>{"<\/div>"}</span><br></br><br></br>
      &nbsp;&nbsp;<span style={{ color: 'Violet' }}>{");"}</span><br></br><br></br>
      <span style={{ color: 'yellow' }}>{"}"}</span>

</p>

    </div>
  );
}

export default About;
