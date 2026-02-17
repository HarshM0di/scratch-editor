import React from "react";

export default function Sprite({ sprite, selected, setSelected }) {
  return (
    <div
      onClick={() => setSelected(sprite.id)}
      className={`absolute w-12 h-12 ${
        selected === sprite.id ? "bg-red-500" : "bg-orange-400"
      }`}
      style={{
        left: sprite.x,
        top: sprite.y,
        transform: `rotate(${sprite.rotation}deg)`
      }}
    >
      {sprite.message && (
        <div className="absolute -top-10 left-0 bg-white border px-2 text-sm">
          {sprite.message}
        </div>
      )}
    </div>
  );
}
