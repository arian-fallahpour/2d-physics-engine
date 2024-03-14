import Sound from "../classes/Sound";
import notes from "../data/notes";
import * as model from "../model";

const playSound = (instrument, noteName) => {
  if (!model.state.sounds[instrument]) {
    model.state.sounds[instrument] = new Sound(
      instrument,
      noteName ? Sound.sprite(notes, 500) : undefined
    );
  }

  return (data) => {
    console.log(model.state.sounds);
    model.state.sounds[instrument].play(noteName);
  };
};

export default playSound;
