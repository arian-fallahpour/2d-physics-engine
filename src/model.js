import Preset from "./classes/Preset";
import {
  requestNextFrame,
  resetFrameMetrics,
} from "./controllers/frameController";
import options from "./data/options";

export const state = {
  play: false,
  step: false,
  presets: [],
  presetIndex: 0,
  preset: null,
  sounds: {},
  melodies: {},
  tones: {},
};

export const play = () => {
  state.play = true;
  document.querySelector(".button-play").textContent = "⏸️";
  requestNextFrame();
};

export const pause = () => {
  state.play = false;
  document.querySelector(".button-play").textContent = "▶️";
};

export const step = () => {
  for (let i = 0; i < options.requestFrameCount; i++) {
    state.play = true;
    state.step = true;
    requestNextFrame();
  }
};

export const loadPresets = (...presets) => {
  state.presets = presets;
};

export const loadPreset = () => {
  setPreset();
  resetFrameMetrics();

  requestNextFrame(true);
};

export const setPreset = (index = state.presetIndex) => {
  const args = state.presets[index];
  state.preset = new Preset(args);
};

/** Sets current state as the next preset */
export const nextPreset = () => {
  pause();

  // Go to next preset
  state.presetIndex = (state.presetIndex + 1) % state.presets.length;

  // Set next preset
  loadPreset();
};

/** Sets current state as the previous preset */
export const previousPreset = () => {
  pause();

  // Go to previous preset
  state.presetIndex =
    (state.presetIndex - 1 + state.presets.length) % state.presets.length;

  // Set previous preset
  loadPreset();
};

export const resetState = () => {
  loadPreset();
};
