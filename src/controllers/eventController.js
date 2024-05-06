import Vector from "../classes/Vector";
import * as model from "../model";

const eventHandler = () => {
  const canvas = model.state.preset.canvas;

  // // SCALE EVENTS
  // window.addEventListener("keydown", (e) => {
  //   if (e.key === "-") {
  //     canvas.setScale(canvas.scale * 0.95);
  //   }

  //   if (e.key === "=") {
  //     canvas.setScale(canvas.scale * 1.05);
  //   }
  // });

  // TRANSLATION EVENTS
  // let dragging = false;
  // const events = ["mousedown", "mouseleave", "mouseup", "mousemove"];
  // events.forEach((event) =>
  //   canvas.element.addEventListener(event, (e) => {
  //     if (e.type === "mousedown") {
  //       dragging = true;
  //     }

  //     if (e.type === "mouseup" || e.type === "mouseleave") {
  //       dragging = false;
  //     }

  //     if (e.type === "mousemove") {
  //       if (!dragging) return;
  //       if (!model.state.play) return;

  //       const translation = new Vector(e.movementX, e.movementY);
  //       canvas.translate(translation);
  //     }
  //   })
  // );

  // BUTTON EVENTS
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
