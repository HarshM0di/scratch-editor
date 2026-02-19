import React, { useState, useRef, useCallback } from "react";
import BlockPalette from "./components/BlockPalette";
import ScriptArea from "./components/ScriptArea";
import Stage from "./components/Stage";
import SpritePanel from "./components/SpritePanel";
import { BLOCK_DEFS, CATEGORIES, STAGE_W, STAGE_H, SPRITE_SIZE } from "./data/blocks";
import { newId, distance, cloneBlock, makeSprite } from "./utils/animation";

export default function App() {
  const [sprites, setSprites] = useState(() => {
    const s1 = makeSprite(0);
    const s2 = makeSprite(1);
    // Position sprites facing each other for collision demo
    s1.x = 50;
    s1.y = STAGE_H / 2 - SPRITE_SIZE / 2;
    s2.x = STAGE_W - SPRITE_SIZE - 50;
    s2.y = STAGE_H / 2 - SPRITE_SIZE / 2;
    return [s1, s2];
  });
  const [activeId, setActiveId]   = useState(() => null);
  const [activeCat, setActiveCat] = useState("motion");
  const [playing, setPlaying]     = useState(false);
  const [collisionHappened, setCollisionHappened] = useState(false);

  const spritesRef  = useRef(null);
  const playingRef  = useRef(false);
  const collidedRef = useRef(new Set());

  // Keep ref in sync
  spritesRef.current = sprites;

  // Derive active sprite safely
  const active = sprites.find((s) => s.id === activeId) || sprites[0] || null;
  const currentActiveId = active ? active.id : null;

  // ── drag & drop ────────────────────────────────────────────────────────────

  const handlePaletteDragStart = useCallback((e, def) => {
    e.dataTransfer.setData("source", "palette");
    e.dataTransfer.setData("defId", def.id);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const source = e.dataTransfer.getData("source");
    if (source !== "palette") return;

    const defId = e.dataTransfer.getData("defId");
    const def = BLOCK_DEFS.find((d) => d.id === defId);
    if (!def) return;

    const targetId = spritesRef.current[0]
      ? (spritesRef.current.find((s) => s.id === currentActiveId) || spritesRef.current[0]).id
      : null;
    if (!targetId) return;

    const newBlock = cloneBlock(def, CATEGORIES);
    setSprites((prev) =>
      prev.map((s) =>
        s.id === targetId ? { ...s, scripts: [...s.scripts, newBlock] } : s
      )
    );
  }, [currentActiveId]);

  const handleRemoveBlock = useCallback((blockUid) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === currentActiveId
          ? { ...s, scripts: s.scripts.filter((b) => b.uid !== blockUid) }
          : s
      )
    );
  }, [currentActiveId]);

  const handleParamChange = useCallback((blockUid, key, value) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === currentActiveId
          ? {
              ...s,
              scripts: s.scripts.map((b) =>
                b.uid === blockUid
                  ? { ...b, params: { ...b.params, [key]: value } }
                  : b
              ),
            }
          : s
      )
    );
  }, [currentActiveId]);

  // ── sprite dragging in playground ──────────────────────────────────────────

  const handleDragSprite = useCallback((spriteId, newX, newY) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId ? { ...s, x: Math.round(newX), y: Math.round(newY) } : s
      )
    );
  }, []);

  // ── hero feature: collision swap ───────────────────────────────────────────

  const checkCollisions = useCallback(() => {
    setSprites((prev) => {
      let changed = false;
      const next = prev.map((s) => ({ ...s, scripts: [...s.scripts] }));

      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const key = next[i].id + ":" + next[j].id;
          if (collidedRef.current.has(key)) continue;
          if (distance(next[i], next[j]) < SPRITE_SIZE * 1.4) {
            collidedRef.current.add(key);
            setCollisionHappened(true); // Visual indicator
            const tmp = next[i].scripts;
            next[i] = { ...next[i], scripts: next[j].scripts.map((b) => ({ ...b, uid: newId() })) };
            next[j] = { ...next[j], scripts: tmp.map((b) => ({ ...b, uid: newId() })) };
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, []);

  // ── animation engine ───────────────────────────────────────────────────────

  const runScript = useCallback(async (spriteId, blocks) => {
    for (let i = 0; i < blocks.length; i++) {
      if (!playingRef.current) return;
      const block = blocks[i];

      await new Promise((resolve) => {
        const delay = (block.id === "say" || block.id === "think")
          ? Number(block.params.dur) * 1000
          : 100;

        setTimeout(() => {
          setSprites((prev) => {
            const sp = prev.find((s) => s.id === spriteId);
            if (!sp) return prev;

            let patch = {};
            if (block.id === "move") {
              const rad = (sp.dir * Math.PI) / 180;
              patch = {
                x: Math.max(0, Math.min(STAGE_W - SPRITE_SIZE, sp.x + Number(block.params.steps) * Math.cos(rad))),
                y: Math.max(0, Math.min(STAGE_H - SPRITE_SIZE, sp.y + Number(block.params.steps) * Math.sin(rad))),
              };
            } else if (block.id === "turn") {
              patch = { dir: (sp.dir + Number(block.params.degrees)) % 360 };
            } else if (block.id === "goto") {
              patch = {
                x: Math.max(0, Math.min(STAGE_W - SPRITE_SIZE, Number(block.params.x) + STAGE_W / 2 - SPRITE_SIZE / 2)),
                y: Math.max(0, Math.min(STAGE_H - SPRITE_SIZE, STAGE_H / 2 - Number(block.params.y) - SPRITE_SIZE / 2)),
              };
            } else if (block.id === "say" || block.id === "think") {
              patch = { bubble: { type: block.id, text: block.params.msg } };
            }

            return prev.map((s) => (s.id === spriteId ? { ...s, ...patch } : s));
          });
          resolve();
        }, delay);
      });

      if (block.id === "say" || block.id === "think") {
        setSprites((prev) =>
          prev.map((s) => (s.id === spriteId ? { ...s, bubble: null } : s))
        );
      }

      checkCollisions();
    }
  }, [checkCollisions]);

  const handlePlay = useCallback(async () => {
    if (playing) {
      playingRef.current = false;
      setPlaying(false);
      collidedRef.current = new Set();
      setCollisionHappened(false);
      setSprites((prev) => prev.map((s) => ({ ...s, bubble: null })));
      return;
    }

    playingRef.current = true;
    setPlaying(true);
    collidedRef.current = new Set();
    setCollisionHappened(false);

    const snap = spritesRef.current;

    const getLoops = (scripts) => {
      const r = scripts.find((b) => b.id === "repeat");
      return r ? Number(r.params.times) : 1;
    };
    const noRepeat = (scripts) => scripts.filter((b) => b.id !== "repeat");
    const maxLoops = Math.max(...snap.map((s) => getLoops(s.scripts)), 1);

    for (let i = 0; i < maxLoops; i++) {
      if (!playingRef.current) break;
      const cur = spritesRef.current;
      await Promise.all(
        cur
          .filter((s) => i < getLoops(s.scripts))
          .map((s) => runScript(s.id, noRepeat(s.scripts)))
      );
    }

    playingRef.current = false;
    setPlaying(false);
  }, [playing, runScript]);

  // ── sprite management ──────────────────────────────────────────────────────

  const handleAddSprite = useCallback(() => {
    if (sprites.length >= 8) return;
    const sp = makeSprite(sprites.length);
    setSprites((prev) => [...prev, sp]);
    setActiveId(sp.id);
  }, [sprites.length]);

  const handleRemoveSprite = useCallback((id) => {
    if (sprites.length <= 1) return;
    setSprites((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) {
      const remaining = sprites.filter((s) => s.id !== id);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [sprites, activeId]);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        height:        "100vh",
        background:    "#1a1d27",
        color:         "white",
        fontFamily:    "system-ui, sans-serif",
        overflow:      "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "8px 16px",
          background:     "#111318",
          borderBottom:   "1px solid #2a2d3d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🐱</span>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Scratch Editor</span>
          <span
            style={{
              fontSize:     11,
              color:        "#555",
              background:   "#1d2030",
              padding:      "2px 8px",
              borderRadius: 20,
            }}
          >
            Visual Coding
          </span>
        </div>
        <button
          onClick={handlePlay}
          style={{
            padding:      "6px 20px",
            borderRadius: 99,
            fontWeight:   700,
            fontSize:     13,
            border:       "none",
            cursor:       "pointer",
            background:   playing ? "#ef4444" : "#22c55e",
            color:        "white",
            boxShadow:    "0 2px 10px rgba(0,0,0,.4)",
          }}
        >
          {playing ? "⏹ Stop" : "▶ Play All"}
        </button>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <BlockPalette
          activeCategory={activeCat}
          setActiveCategory={setActiveCat}
          onDragStart={handlePaletteDragStart}
        />

        <ScriptArea
          sprite={active}
          onDrop={handleDrop}
          onParamChange={handleParamChange}
          onRemoveBlock={handleRemoveBlock}
        />

        <div
          style={{
            flexShrink:    0,
            display:       "flex",
            flexDirection: "column",
            borderLeft:    "1px solid #2a2d3d",
            background:    "#12141d",
          }}
        >
          <Stage
            sprites={sprites}
            activeId={currentActiveId}
            onSelectSprite={setActiveId}
            onDragSprite={handleDragSprite}
          />
          <SpritePanel
            sprites={sprites}
            activeId={currentActiveId}
            onSelect={setActiveId}
            onAdd={handleAddSprite}
            onRemove={handleRemoveSprite}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign:   "center",
          padding:     "4px 0",
          fontSize:    11,
          color:       "#444",
          borderTop:   "1px solid #2a2d3d",
          background:  "#111318",
        }}
      >
        Drag blocks → Drop into script → Press ▶ Play &nbsp;|&nbsp;
        <span style={{ color: "#f59e0b", fontWeight: 700 }}>Hero Feature:</span>
        {" "}sprites swap animations on collision!
        {collisionHappened && (
          <span style={{ color: "#22c55e", fontWeight: 700, marginLeft: 8 }}>
            ✓ COLLISION DETECTED - Scripts Swapped!
          </span>
        )}
      </div>
    </div>
  );
}