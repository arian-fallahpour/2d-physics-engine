import * as model from "../model";
import * as Tone from "tone";
import midi from "../songs/midis/tetris.json";

const eventHandler = () => {
  // EVENT HANDLERS
  const buttons = document.querySelector(".buttons");
  buttons.addEventListener("click", (e) => {
    // Play / pause button
    if (e.target.classList.contains("button-play")) {
      if (model.state.play) {
        return model.pause();
      }

      model.play();
    }

    // Reset button
    if (e.target.classList.contains("button-reset")) {
      model.resetState();
    }

    // Next preset button
    if (e.target.classList.contains("button-next")) {
      model.nextPreset();
    }

    // Previous preset button
    if (e.target.classList.contains("button-previous")) {
      model.previousPreset();
    }

    // Step one frame
    if (e.target.classList.contains("button-step")) {
      model.step();
    }
  });
};

export default eventHandler;
