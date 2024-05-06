import * as Tone from "tone";

import * as model from "../model";

const playTone = (track, instrument = "Synth", condition = (data) => true) => {
  const tones = model.state.audio.tones;
  const notes = track.notes
    .filter(
      (note, i, arr) =>
        i === 0 ||
        (note.time !== arr[i - 1].time && note.time - arr[i - 1].time > 0.1)
    )
    .map((note, i, arr) => ({
      ...note,
      time: note.time - arr[0].time,
    }))
    .slice(0, track.notes.length);

  if (!tones.synth) {
    tones.synth = new Tone[instrument]().toDestination();
  }

  return (data) => {
    if (condition(data)) {
      const now = Tone.now();

      const note = notes[model.state.audio.note % notes.length];

      tones.synth.triggerAttackRelease(
        note.name,
        note.duration,
        now,
        note.velocity
      );

      model.state.audio.note =
        (model.state.audio.note + 1) % track.notes.length;
    }
  };
};

export default playTone;
