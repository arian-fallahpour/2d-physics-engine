import Sound from "./Sound";

import melodies from "../data/melodies.json";
import notes from "../data/notes";

class Melody {
  constructor(name, instrument = "piano") {
    this.instrument = instrument;
    this.sound = new Sound(`${this.instrument}`, Sound.sprite(notes, 500));
    this.sequence = melodies[name];
    this.sequenceIndex = 0;
  }

  /** Plays current note in sequence and optionally increments */
  playNote(increment = true) {
    const note = this.sequence[this.sequenceIndex];
    this.sound.play(note);

    // Increment current sequence index
    if (increment) {
      this.sequenceIndex = (this.sequenceIndex + 1) % this.sequence.length;
    }
  }
}

export default Melody;
