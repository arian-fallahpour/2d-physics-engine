import * as Tone from "tone";

const playMelody = (midi, track, note = 0, condition = (data) => true) => {
  const synth = new Tone.Synth().toDestination();
  const notes = midi.tracks[track].notes;

  return (data) => {
    if (condition(data)) {
      note = note % notes.length;
      console.log(note);
      synth.triggerAttackRelease(
        notes[note].name,
        notes[note].duration,
        Tone.now(),
        notes[note].velocity
      );

      if (note >= notes.length) {
        note = 0;
      } else {
        note += 1;
      }
    }
  };
};

export default playMelody;
