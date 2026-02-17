import React from "react";

export default function SpeechBubble({ text, type }) {
  return (
    <div
      style={{
        position:  "absolute",
        bottom:    "110%",
        left:      "50%",
        transform: "translateX(-50%)",
        zIndex:    20,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background:   "white",
          color:        "#222",
          fontSize:     11,
          fontWeight:   600,
          padding:      "5px 8px",
          borderRadius: 12,
          boxShadow:    "0 2px 12px rgba(0,0,0,.2)",
          textAlign:    "center",
          border:       type === "think" ? "2px dashed #9966FF" : "2px solid #bfdbfe",
          whiteSpace:   "nowrap",
          minWidth:     60,
        }}
      >
        {text}
        <div
          style={{
            position:  "absolute",
            bottom:    -10,
            left:      "50%",
            transform: "translateX(-50%)",
            fontSize:  13,
          }}
        >
          {type === "think" ? "💭" : "💬"}
        </div>
      </div>
    </div>
  );
}