import React from "react";

export default function Controls({ play, addSprite }) {
  return (
    <div className="bg-gray-200 p-3 flex gap-3">
      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={play}
      >
        Play
      </button>

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={addSprite}
      >
        Add Sprite
      </button>
    </div>
  );
}
