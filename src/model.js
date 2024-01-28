import canvas from "./Classes/Canvas";
import frameHandler from "./controllers/frameController";
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

/** Sets current state as the next preset */
export const nextPreset = () => {
  pause();

  // Reset last state
  state.presets[state.preset].reset();

  // Pause engine and skip to next frame
  canvas.clear();
  requestAnimationFrame(frameHandler);

  state.preset = (state.preset + 1) % state.presets.length;
};

/** Sets current state as the previous preset */
export const previousPreset = () => {
  pause();

  // Reset last state
  state.presets[state.preset].reset();

  // Pause engine and skip to next frame
  canvas.clear();
  requestAnimationFrame(frameHandler);

  state.preset =
    (state.preset - 1 + state.presets.length) % state.presets.length;
};

export const resetState = () => {
  state.presets[state.preset].reset();
};
