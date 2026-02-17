import React from "react";

export default function SpritePanel({ sprites, activeId, onSelect, onAdd, onRemove }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   8,
        }}
      >
        <span
          style={{
            fontSize:      10,
            fontWeight:    700,
            color:         "#555",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Sprites
        </span>
        <button
          onClick={onAdd}
          disabled={sprites.length >= 8}
          style={{
            fontSize:     11,
            padding:      "3px 10px",
            background:   "#3b82f6",
            color:        "white",
            border:       "none",
            borderRadius: 8,
            cursor:       "pointer",
            fontWeight:   700,
            opacity:      sprites.length >= 8 ? 0.4 : 1,
          }}
        >
          + Add
        </button>
      </div>

      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 6,
        }}
      >
        {sprites.map((sp) => (
          <div
            key={sp.id}
            onClick={() => onSelect(sp.id)}
            style={{
              position:       "relative",
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              padding:        "8px 4px",
              borderRadius:   10,
              cursor:         "pointer",
              border:         "2px solid " + (activeId === sp.id ? "#4C97FF" : "#2a2d3d"),
              background:     activeId === sp.id ? "rgba(76,151,255,.1)" : "#1a1d27",
              transition:     "all .12s",
            }}
          >
            <span style={{ fontSize: 24 }}>{sp.emoji}</span>
            <span
              style={{
                fontSize:     11,
                color:        "#bbb",
                fontWeight:   600,
                maxWidth:     65,
                overflow:     "hidden",
                textOverflow: "ellipsis",
                whiteSpace:   "nowrap",
              }}
            >
              {sp.name}
            </span>
            <span style={{ fontSize: 10, color: "#555" }}>
              {sp.scripts.filter((b) => b.id !== "repeat").length} blocks
            </span>

            {sprites.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(sp.id); }}
                style={{
                  position:   "absolute",
                  top:        2,
                  right:      4,
                  background: "transparent",
                  border:     "none",
                  color:      "#555",
                  cursor:     "pointer",
                  fontSize:   14,
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.target.style.color = "#555")}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}