import React from "react";
import { BLOCK_DEFS, CATEGORIES } from "../data/blocks";

export function BlockPill({ block, onParamChange }) {
  return (
    <div
      style={{
        display:    "inline-flex",
        alignItems: "center",
        gap:        4,
        background: block.color,
        color:      "white",
        borderRadius: 99,
        padding:    "5px 12px",
        fontSize:   12,
        fontWeight: 700,
        cursor:     "grab",
        userSelect: "none",
        boxShadow:  "0 2px 8px rgba(0,0,0,.3)",
      }}
    >
      <span>{block.label}</span>

      {Array.isArray(block.pDefs) && block.pDefs.map((p) => (
        <span key={p.key} style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {p.unit && p.unit !== "" && (
            <span style={{ opacity: 0.75, fontSize: 11 }}>{p.unit}</span>
          )}
          {onParamChange ? (
            <input
              type={typeof p.def === "number" ? "number" : "text"}
              value={block.params[p.key]}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                onParamChange(
                  block.uid,
                  p.key,
                  typeof p.def === "number" ? Number(e.target.value) : e.target.value
                )
              }
              style={{
                width:        50,
                borderRadius: 6,
                padding:      "1px 4px",
                textAlign:    "center",
                fontSize:     11,
                color:        "#111",
                fontWeight:   700,
                border:       "none",
                outline:      "none",
              }}
            />
          ) : (
            <span
              style={{
                background:   "rgba(255,255,255,.25)",
                borderRadius: 6,
                padding:      "1px 6px",
                fontSize:     11,
              }}
            >
              {block.params[p.key]}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function BlockPalette({ activeCategory, setActiveCategory, onDragStart }) {
  const visible = BLOCK_DEFS.filter((d) => d.cat === activeCategory);

  return (
    <div
      style={{
        width:          200,
        flexShrink:     0,
        background:     "#12141d",
        borderRight:    "1px solid #2a2d3d",
        display:        "flex",
        flexDirection:  "column",
        overflow:       "hidden",
      }}
    >
      <div
        style={{
          padding:       8,
          display:       "flex",
          flexDirection: "column",
          gap:           4,
          borderBottom:  "1px solid #2a2d3d",
        }}
      >
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            style={{
              padding:      "6px 12px",
              borderRadius: 8,
              border:       "none",
              cursor:       "pointer",
              fontWeight:   700,
              fontSize:     12,
              textAlign:    "left",
              background:   activeCategory === key ? cat.color : "transparent",
              color:        activeCategory === key ? "white" : "#666",
              transition:   "all .1s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div
        style={{
          flex:          1,
          overflowY:     "auto",
          padding:       10,
          display:       "flex",
          flexDirection: "column",
          gap:           8,
        }}
      >
        {visible.map((def) => {
          const previewBlock = {
            uid:    "pal-" + def.id,
            id:     def.id,
            cat:    def.cat,
            label:  def.label,
            color:  CATEGORIES[def.cat].color,
            params: Object.fromEntries(def.params.map((p) => [p.key, p.def])),
            pDefs:  def.params,
          };
          return (
            <div
              key={def.id}
              draggable
              onDragStart={(e) => onDragStart(e, def)}
            >
              <BlockPill block={previewBlock} />
            </div>
          );
        })}
      </div>
    </div>
  );
}