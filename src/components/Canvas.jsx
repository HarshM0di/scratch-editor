import React from "react";
import Sprite from "./Sprite";

export default function Canvas({ sprites, selected, setSelected }) {
  return (
    <div className="flex-1 bg-white relative">
      {sprites.map(sprite => (
        <Sprite
          key={sprite.id}
          sprite={sprite}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </div>
  );
}
