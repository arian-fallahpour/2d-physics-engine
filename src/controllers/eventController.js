import * as model from "../model";
import * as Tone from "tone";
import midi from "../songs/midis/TADC.json";

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

  const musicButton = document.querySelector(".button-music");
  musicButton.addEventListener("click", async (e) => {
    await Tone.start();

    const synth = new Tone.Synth().toDestination();
    const treble = midi.tracks[0].notes.splice(0, 100);
    treble.forEach((note, i) => {
      const now = Tone.now();
      synth.triggerAttackRelease(
        note.name,
        note.duration,
        now + note.time + i / 100000,
        note.velocity
      );
    });
  });
};

export default eventHandler;
