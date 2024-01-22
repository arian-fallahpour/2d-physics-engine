import { deserialize, serialize } from "./helper";

export const state = {
  objects: {
    balls: [],
    walls: [],
    circles: [],
    vectors: [],
    fractals: [],
  },
  play: false,
  collisions: 0,
  presets: [],
  preset: 0,
  sounds: {},
  melodies: {},
  reverting: false,
  fractalsAngle: 0,
  fractalsDirection: +0.5,
  options: {
    requestFrameCount: 1, // Higher velue makes simulation more accurate, but is more resource intensive
  },
};

/** Increments collisions in state */
export const collided = () => {
  state.collisions += 1;
};

export const pause = () => {
  state.play = false;
  document.querySelector(".button-play").textContent = "▶️";
};

export const play = () => {
  state.play = true;
  document.querySelector(".button-play").textContent = "⏸️";
};

export const setState = (type, preset) => {
  if (!["static", "dynamic"].includes(type)) return;
  const serialized = serialize(preset);
  state[type] = deserialize(serialized); // Prevents referencing of data
};

export const updateStates = () => {
  const preset = state.presets[state.preset] || state.static;

  setState("static", preset);
  setState("dynamic", preset);
};

/** Saves static state as a preset to local storage*/
export const saveState = () => {
  const preset = state.static;
  state.presets.push(preset);

  localStorage.setItem("presets", serialize(state.presets));
};

/** Retrieves presets from local storage*/
export const loadState = () => {
  const str = localStorage.getItem("presets");
  if (!str) return;

  const presets = deserialize(str);

  // Set presets state if exists
  if (!presets.length) return;
  state.presets = presets;

  // Update states
  updateStates();
};

export const deletePreset = () => {
  if (!state.presets.length) return;

  state.presets.splice(state.preset, 1);
  localStorage.setItem("presets", serialize(state.presets));
};

export const resetState = () => {
  updateStates();
};

/** Sets current state as the next preset */
export const nextPreset = () => {
  state.preset = (state.preset + 1) % state.presets.length;
  updateStates();
};

/** Sets current state as the previous preset */
export const previousPreset = () => {
  state.preset = (state.preset + 1) % state.presets.length;
  updateStates();
};
