const EMOJIS = ["🐱","🐶","🦊","🐸","🐧","🦄","🐺","🐻"];

let _id = 0;
export const newId = () => String(++_id);

export const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const cloneBlock = (def, categories) => ({
  uid:    newId(),
  id:     def.id,
  cat:    def.cat,
  label:  def.label,
  color:  categories[def.cat].color,
  params: Object.fromEntries(def.params.map((p) => [p.key, p.def])),
  pDefs:  def.params,
});

export const makeSprite = (index) => ({
  id:      newId(),
  name:    "Sprite " + (index + 1),
  emoji:   EMOJIS[index % EMOJIS.length],
  x:       60 + index * 120,
  y:       155,
  dir:     0,
  scripts: [],
  bubble:  null,
});