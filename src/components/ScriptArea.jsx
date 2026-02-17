import React from "react";
import { BlockPill } from "./BlockPalette";

export default function ScriptArea({ sprite, onDrop, onParamChange, onRemoveBlock }) {
  if (!sprite) {
    return (
      <div style={{ flex: 1, background: "#1d2030" }} />
    );
  }

  return (
    <div
      style={{
        flex:      1,
        overflowY: "auto",
        padding:   16,
        background:"#1d2030",
        minWidth:  0,
      }}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{sprite.emoji}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: "white" }}>
          {sprite.name}
        </span>
        <span style={{ fontSize: 11, color: "#555" }}>— drop blocks here</span>
      </div>

      {sprite.scripts.length === 0 && (
        <div
          style={{
            border:       "2px dashed #2a2d3d",
            borderRadius: 12,
            padding:      "40px 20px",
            textAlign:    "center",
            color:        "#444",
            fontSize:     13,
          }}
        >
          Drag blocks from the palette and drop them here
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sprite.scripts.map((block) => (
          <div key={block.uid} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BlockPill block={block} onParamChange={onParamChange} />
            <button
              onClick={() => onRemoveBlock(block.uid)}
              style={{
                background: "transparent",
                border:     "none",
                color:      "#ef4444",
                cursor:     "pointer",
                fontSize:   20,
                lineHeight: 1,
                opacity:    0.5,
                padding:    0,
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 1)}
              onMouseLeave={(e) => (e.target.style.opacity = 0.5)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}