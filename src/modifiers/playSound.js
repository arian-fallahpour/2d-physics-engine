import Sound from "../classes/Sound";
import notes from "../data/notes";
import { state } from "../model";

const playSound = (file) => {
  if (!state.audio.sounds[file]) {
    state.audio.sounds[file] = new Sound(file);
  }

  return (data) => {
    state.audio.sounds[file].play();
  };
};

export default playSound;
