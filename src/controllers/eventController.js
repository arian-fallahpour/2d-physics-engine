import * as model from "../model";

import frameHandler, { requestNextFrame } from "./frameController";

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
      requestNextFrame(false);
    }

    // Save button
    if (e.target.classList.contains("button-save")) {
      // model.saveState();
      requestAnimationFrame(frameHandler);
    }

    // Reload button
    if (e.target.classList.contains("button-reload")) {
      model.resetState();
    }

    // Delete button
    if (e.target.classList.contains("button-delete")) {
      model.deletePreset();
    }

    // Next preset button
    if (e.target.classList.contains("button-next")) {
      model.nextPreset();
    }

    // Previous preset button
    if (e.target.classList.contains("button-previous")) {
      model.previousPreset();
    }
  });
};

export default eventHandler;
