export const CATEGORIES = {
  motion:  { label: "Motion",  color: "#4C97FF" },
  control: { label: "Control", color: "#FFAB19" },
  looks:   { label: "Looks",   color: "#9966FF" },
};

export const BLOCK_DEFS = [
  { id: "move",   cat: "motion",  label: "Move",   params: [{ key: "steps",   def: 10,       unit: "steps" }] },
  { id: "turn",   cat: "motion",  label: "Turn",   params: [{ key: "degrees", def: 15,       unit: "deg"   }] },
  { id: "goto",   cat: "motion",  label: "Go to",  params: [{ key: "x",       def: 0,        unit: "x:"    }, { key: "y", def: 0, unit: "y:" }] },
  { id: "repeat", cat: "control", label: "Repeat", params: [{ key: "times",   def: 5,        unit: "times" }] },
  { id: "say",    cat: "looks",   label: "Say",    params: [{ key: "msg",     def: "Hello!", unit: ""      }, { key: "dur", def: 2, unit: "sec" }] },
  { id: "think",  cat: "looks",   label: "Think",  params: [{ key: "msg",     def: "Hmm...", unit: ""      }, { key: "dur", def: 2, unit: "sec" }] },
];

export const STAGE_W     = 480;
export const STAGE_H     = 360;
export const SPRITE_SIZE = 50;