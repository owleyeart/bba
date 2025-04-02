///////////////////////////////////////////////////////
// CallToAction.jsx – Styled like About.css
///////////////////////////////////////////////////////

import React from "react";
import "../About.css"; // ✅ Import styles if not already applied globally

const CallToAction = ({
  heading = "Ready to Begin?",
  text = "Whether you're celebrating a moment, capturing your essence, or just curious about what’s possible — I'd love to collaborate on a portrait that’s truly yours.",
  buttonText = "Book Your Portrait Session",
  buttonLink = "/book"
}) => {
  return (
    <div className="console-log" style={{
      marginTop: "3rem",
      paddingTop: "2rem",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    }}>
      <h2 className="function-title" style={{ marginBottom: "1rem" }}>
        {heading}
      </h2>
      <p style={{
        fontFamily: "Consolas, monospace",
        color: "#d4d4d4",
        lineHeight: "1.6",
        fontSize: "1rem",
        marginBottom: "1.5rem"
      }}>
        {text}
      </p>
      <a
  href={buttonLink}
  className="code-button"
>
  {buttonText}
</a>

    </div>
  );
};

export default CallToAction;
