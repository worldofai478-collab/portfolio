import React, { useState } from "react";

export default function Card() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <div className="card-container">
      <img
        src="/avatar.png"
        alt="Avatar"
        title="Gangothry – Software & AI Engineer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={() => setClicked(true)}
        onMouseUp={() => setClicked(false)}
        className={`avatar-image ${hovered ? "hovered" : ""} ${
          clicked ? "clicked" : ""
        }`}
      />
    </div>
  );
}
