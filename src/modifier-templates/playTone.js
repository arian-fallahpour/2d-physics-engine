import * as Tone from "tone";

import * as model from "../model";

const playToneTemplate = (note, instrument = "Synth") => {
  if (!model.state.tones.synth) {
    model.state.tones.synth = new Tone[instrument]().toDestination();
  }

  return (data) => {
    const now = Tone.now();
    model.state.tones.synth.triggerAttackRelease(
      note.name,
      note.duration,
      now,
      note.velocity
    );
  };
};

export default playToneTemplate;
