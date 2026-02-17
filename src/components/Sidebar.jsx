import React from "react";

export default function Sidebar({ addBlock }) {
  return (
    <div className="w-64 bg-gray-100 p-4 space-y-3">
      <h2 className="font-bold">Motion</h2>

      <button
        className="bg-blue-500 text-white p-2 w-full"
        onClick={() => addBlock({ type: "MOVE", value: 10 })}
      >
        Move 10 steps
      </button>

      <button
        className="bg-blue-500 text-white p-2 w-full"
        onClick={() => addBlock({ type: "TURN", value: 15 })}
      >
        Turn 15°
      </button>

      <button
        className="bg-blue-500 text-white p-2 w-full"
        onClick={() => addBlock({ type: "GOTO", x: 50, y: 50 })}
      >
        Go To (50,50)
      </button>

      <button
        className="bg-yellow-500 text-white p-2 w-full"
        onClick={() => addBlock({ type: "REPEAT", times: 3 })}
      >
        Repeat 3 times
      </button>

      <h2 className="font-bold mt-4">Looks</h2>

      <button
        className="bg-purple-500 text-white p-2 w-full"
        onClick={() =>
          addBlock({ type: "SAY", text: "Hello!", seconds: 2 })
        }
      >
        Say Hello
      </button>

      <button
        className="bg-purple-500 text-white p-2 w-full"
        onClick={() =>
          addBlock({ type: "THINK", text: "Thinking...", seconds: 2 })
        }
      >
        Think...
      </button>
    </div>
  );
}
