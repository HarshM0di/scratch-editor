import React from "react";
import { STAGE_W, STAGE_H, SPRITE_SIZE } from "../data/blocks";
import SpeechBubble from "./SpeechBubble";

export default function Stage({ sprites, activeId, onSelectSprite, onDragSprite }) {
  const handleDrag = (e, spriteId) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Ignore invalid positions
    
    const stageRect = e.currentTarget.parentElement.getBoundingClientRect();
    const newX = e.clientX - stageRect.left - SPRITE_SIZE / 2;
    const newY = e.clientY - stageRect.top - SPRITE_SIZE / 2;
    
    // Constrain to stage boundaries
    const boundedX = Math.max(0, Math.min(STAGE_W - SPRITE_SIZE, newX));
    const boundedY = Math.max(0, Math.min(STAGE_H - SPRITE_SIZE, newY));
    
    if (onDragSprite) {
      onDragSprite(spriteId, boundedX, boundedY);
    }
  };

  return (
    <div
      style={{
        position:   "relative",
        width:      STAGE_W,
        height:     STAGE_H,
        background: "white",
        overflow:   "hidden",
        flexShrink: 0,
      }}
    >
      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none" }}
        width={STAGE_W}
        height={STAGE_H}
      >
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={"v" + i} x1={i * 40} y1={0} x2={i * 40} y2={STAGE_H} stroke="#94a3b8" strokeWidth={1} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={"h" + i} x1={0} y1={i * 40} x2={STAGE_W} y2={i * 40} stroke="#94a3b8" strokeWidth={1} />
        ))}
        <line x1={STAGE_W / 2} y1={0} x2={STAGE_W / 2} y2={STAGE_H} stroke="#ef4444" strokeWidth={1} opacity={0.3} />
        <line x1={0} y1={STAGE_H / 2} x2={STAGE_W} y2={STAGE_H / 2} stroke="#ef4444" strokeWidth={1} opacity={0.3} />
      </svg>

      {Array.isArray(sprites) && sprites.map((sp) => (
        <div
          key={sp.id}
          draggable
          onClick={() => onSelectSprite(sp.id)}
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
          }}
          onDrag={(e) => handleDrag(e, sp.id)}
          style={{
            position:   "absolute",
            left:       sp.x,
            top:        sp.y,
            width:      SPRITE_SIZE,
            height:     SPRITE_SIZE,
            fontSize:   30,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:     "grab",
            transform:  "rotate(" + sp.dir + "deg)",
            filter:     activeId === sp.id
              ? "drop-shadow(0 0 8px #4C97FF) drop-shadow(0 0 3px #4C97FF)"
              : "none",
            transition: "filter 0.2s",
          }}
        >
          {sp.bubble && (
            <SpeechBubble text={sp.bubble.text} type={sp.bubble.type} />
          )}
          {sp.emoji}
        </div>
      ))}

      {/* Coordinate Display */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "monospace",
          pointerEvents: "none",
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {sprites.find((s) => s.id === activeId) ? (
          <>
            X: {Math.round(sprites.find((s) => s.id === activeId).x)} | 
            Y: {Math.round(sprites.find((s) => s.id === activeId).y)}
          </>
        ) : (
          "No sprite selected"
        )}
      </div>
    </div>
  );
}