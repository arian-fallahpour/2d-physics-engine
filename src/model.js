import Preset from "./classes/Preset";
import {
  requestNextFrame,
  resetFrameMetrics,
} from "./controllers/frameController";

export const state = {
  play: false,
  step: false,
  presets: [],
  presetIndex: 0,
  preset: null,
  sounds: {},
  melodies: {},
  tones: {},
  engine: {},
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
  for (let i = 0; i < state.preset.options.stepsPerFrame; i++) {
    state.play = true;
    state.step = true;
    requestNextFrame();
  }
};

export const loadPresets = (...presets) => {
  state.presets = presets;
};

export const initPreset = () => {
  state.preset = new Preset(state.presets[state.presetIndex]);
  state.preset.init();

  resetFrameMetrics();

  requestNextFrame(true);
};

export const nextPreset = () => {
  pause();

  state.presetIndex = (state.presetIndex + 1) % state.presets.length;

  initPreset();
};

export const previousPreset = () => {
  pause();

  state.presetIndex =
    (state.presetIndex - 1 + state.presets.length) % state.presets.length;

  initPreset();
};

export const resetState = () => {
  initPreset();
};
