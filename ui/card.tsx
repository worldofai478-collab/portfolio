import React, { useState } from "react";

export default function Card() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src="/avatar.png"
        alt="Avatar"
        title="Gangothry – Software & AI Engineer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={() => setClicked(true)}
        onMouseUp={() => setClicked(false)}
        style={{
          width: '260px',
          height: '360px',
          borderRadius: '16px',
          objectFit: 'cover',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: hovered ? (clicked ? 'scale(0.95)' : 'scale(1.05)') : 'scale(1)',
          boxShadow: hovered
            ? '0 0 12px 4px rgba(128, 128, 128, 0.4)'
            : '0 0 6px 2px rgba(128, 128, 128, 0.3)',
        }}
      />
    </div>
  );
}
