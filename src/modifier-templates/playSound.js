import Sound from "../classes/Sound";
import notes from "../data/notes";
import * as model from "../model";

const playSoundTemplate = (instrument, noteName) => {
  if (!model.state.sounds[instrument]) {
    model.state.sounds[instrument] = new Sound(
      instrument,
      Sound.sprite(notes, 500)
    );
  }

  return (data) => {
    model.state.sounds[instrument].play(noteName);
  };
};

export default playSoundTemplate;
